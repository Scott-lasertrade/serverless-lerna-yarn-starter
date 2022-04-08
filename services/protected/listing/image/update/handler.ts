import 'source-map-support/register';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import { Database, Listing, ListingImage } from '@medii/data';
import { AppError } from '@medii/common';
import { addImages, prepareImageData, removeImages } from '@medii/s3';
import schema from './schema';

const bucket = process.env.LISTINGBUCKETNAME;

const database = new Database();

const task = async (event) => {
    const id = event.pathParameters?.id;

    if (!Number(id)) {
        throw new AppError(`Incorrect id format provided - ${id}`, 400);
    }
    const dbConn = await database.getConnection();

    const existingImages = await dbConn
        .createQueryBuilder(ListingImage, 'limg')
        .innerJoinAndSelect('limg.listing', 'l')
        .innerJoin('l.account', 'account')
        .innerJoin('account.users', 'u')
        .where('l.id = :listingId', { listingId: Number(id) })
        .andWhere('u.cognito_user_id = :userId', {
            userId: event.headers.currentuserid,
        })
        .getMany();

    const imageData = prepareImageData(event.body.imagesList, existingImages);
    const { imagesToDelete, imagesToReplace, imagesToShift, imagesToCreate } =
        imageData;

    let returnedImageData = existingImages
        .filter(
            (existingImage) =>
                !imagesToDelete
                    .filter((img) => Number(img.id))
                    .map((img) => Number(img.id))
                    .includes(existingImage.id ?? 0)
        )
        .filter(
            (existingImage) =>
                !imagesToReplace
                    .filter((img) => Number(img.id))
                    .map((img) => Number(img.id))
                    .includes(existingImage.id)
        )
        .filter(
            (existingImage) =>
                !imagesToShift
                    .filter((img) => Number(img.id))
                    .map((img) => Number(img.id))
                    .includes(existingImage.id)
        );
    console.log('Updating listing...');
    await dbConn.transaction(async (transactionalEntityManager) => {
        console.log('*** START TRANSACTION ***');
        console.log('Removing Images...');
        const removedS3Imgs = (
            await removeImages(Number(id), imagesToDelete, bucket ?? '')
        ).map((img) =>
            Object.assign(new ListingImage(), {
                id: img.id,
                bucket: bucket,
                key: img.key,
                region: img.region,
                order: img.order,
                listing: new Listing(Number(id)),
                deleted_date: img.deleted_date,
                s3VersionId: img.s3VersionId,
                updated_by: event.headers.authorizeduserid,
            })
        );
        const deletedImages =
            removedS3Imgs.length > 0
                ? await transactionalEntityManager
                      .getRepository(ListingImage)
                      .save(removedS3Imgs)
                : [];

        console.log('Removed Images...', deletedImages, removedS3Imgs);

        const changedImages = await addImages(
            id,
            [...imagesToReplace, ...imagesToShift],
            bucket ?? ''
        );

        const updatedImages = changedImages
            .filter((img) => Number(img.id))
            .map((img) =>
                Object.assign(new ListingImage(), {
                    id: img.id,
                    bucket: bucket,
                    key: img.key,
                    region: img.region,
                    order: img.order,
                    listing: new Listing(Number(id)),
                    s3VersionId: img.versionId,
                    updated_by: event.headers.authorizeduserid,
                })
            );
        const replacedImages =
            imagesToReplace.length > 0 || imagesToShift.length > 0
                ? await transactionalEntityManager
                      .getRepository(ListingImage)
                      .save(updatedImages)
                : [];
        console.log('Updated Images...', replacedImages);

        const createdImages =
            imagesToCreate.length > 0
                ? await Promise.all(
                      imagesToCreate.map(async (img) => {
                          const toSave = Object.assign(new ListingImage(), {
                              bucket: bucket,
                              region: img.region,
                              order: img.order,
                              listing: new Listing(Number(id)),
                              created_by: event.headers.authorizeduserid,
                              updated_by: event.headers.authorizeduserid,
                          });
                          const result = await transactionalEntityManager
                              .getRepository(ListingImage)
                              .save(toSave);

                          return {
                              id: result.id,
                              key: `images/${result.id}`,
                              bucket: bucket,
                              region: img.region,
                              order: img.order,
                              listing: result.listing,
                              image: img.image,
                              mime: img.mime,
                          };
                      })
                  )
                : [];

        const uploadedImages = await addImages(
            Number(id),
            [...createdImages],
            bucket ?? ''
        );
        console.log('Added Images: ', uploadedImages);
        const updateCreatedImage = uploadedImages
            .filter((img) => Number(img.id))
            .map((img) =>
                Object.assign(new ListingImage(), {
                    id: img.id,
                    bucket: bucket,
                    key: img.key,
                    region: img.region,
                    order: img.order,
                    listing: new Listing(Number(id)),
                    s3VersionId: img.versionId,
                    updated_by: event.headers.authorizeduserid,
                })
            );

        const insertedImages =
            updateCreatedImage.length > 0
                ? await transactionalEntityManager
                      .getRepository(ListingImage)
                      .save(updateCreatedImage)
                : [];

        returnedImageData = [
            ...returnedImageData,
            ...replacedImages,
            ...insertedImages,
        ];

        console.log('Created Images...', insertedImages);
        console.log('*** FINISH TRANSACTION ***');
    });
    return { id: id, images: returnedImageData };
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    return await handleTimeout(task(event), context);
};
export const main = middyfy(handler);
