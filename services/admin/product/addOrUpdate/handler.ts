import 'source-map-support/register';
import schema from './schema';
import 'typeorm-aurora-data-api-driver';
import { handleTimeout, middyfy } from '@medii/api-lambda';
import { ValidatedEventAPIGatewayProxyEvent } from '@medii/api-common';
import {
    Database,
    Category,
    Dimension,
    Manufacturer,
    Product,
    ProductImage,
    ProductType,
    UsageType,
} from '@medii/data';
import { AppError } from '@medii/common';
import { addImages, prepareImageData, removeImages } from '@medii/s3';

const database = new Database();

const bucket = process.env.PRODUCTBUCKETNAME;

const setupExternalConnections = async (
    transactionalEntityManager: any,
    productId: number,
    connections: number[]
) => {
    let connectionsToSave: Product[] = [];
    if (connections?.length > 0) {
        connectionsToSave = await Promise.all(
            connections.map(async (acc) => {
                const toReturn = await transactionalEntityManager
                    .getRepository(Product)
                    .findOneOrFail(acc, {
                        relations: ['connections'],
                    });

                const index = toReturn.connections.findIndex(
                    (p: Product) => p.id === productId
                );
                if (index === -1) {
                    toReturn.connections.push(productId);
                }
                return toReturn;
            })
        );
    }
    return connectionsToSave;
};

const task = async (event) => {
    const dbConn = await database.getConnection();
    const connections = event.body.connections;
    let product: Product = new Product();
    if (event.body.id) {
        product = new Product(event.body.id, event.body.version);
    } else {
        product = new Product();
    }

    console.log(`Product[${event.body.id ?? 'NEW'}]| Start`);

    product.product_type = event.body.productTypeId
        ? await dbConn
              .getRepository(ProductType)
              .findOneOrFail(event.body.productTypeId)
        : new ProductType();

    product.name = event.body.name;
    product.description = event.body.description;
    product.specification = event.body.specification;
    product.is_active = event.body.isActive;
    product.is_draft = event.body.isDraft;

    product.usage_type = event.body.usageTypeId
        ? new UsageType(event.body.usageTypeId)
        : new UsageType();

    let productDimensions: Dimension;
    if (event.body.dimensionsId) {
        productDimensions = new Dimension(event.body.dimensionsId);
    } else {
        productDimensions = new Dimension();
        productDimensions.created_by =
            event.headers.AuthorizedUserId ?? event.headers.authorizeduserid;
    }
    productDimensions.weight = event.body.weight;
    productDimensions.length = event.body.length;
    productDimensions.width = event.body.width;
    productDimensions.height = event.body.height;

    product.categories =
        event.body.categories?.length > 0
            ? event.body.categories.map((itm: number) => new Category(itm))
            : null;

    let manufacturerIds: Manufacturer[] =
        event.body.manufacturers?.length > 0
            ? event.body.manufacturers
                  .filter((x) => Number(x.key))
                  .map((itm) => new Manufacturer(Number(itm.key)))
            : [];
    const newManufacturers: string[] =
        event.body.manufacturers?.length > 0
            ? event.body.manufacturers
                  .filter((x) => !Number(x.key))
                  .map((itm) => itm.value)
            : [];

    await dbConn
        .transaction(async (transactionalEntityManager) => {
            console.log('*** START TRANSACTION ***');

            if (newManufacturers?.length > 0) {
                const mappedManufacturers = newManufacturers.map(
                    (manufacturer: string) => {
                        const newManufacturer = new Manufacturer();
                        newManufacturer.name = manufacturer;
                        newManufacturer.created_by =
                            event.headers.AuthorizedUserId ??
                            event.headers.authorizeduserid;
                        return newManufacturer;
                    }
                );
                console.log('Manufacturers| Adding...', mappedManufacturers);
                const createdManufacturers = await transactionalEntityManager
                    .getRepository(Manufacturer)
                    .save(mappedManufacturers);

                manufacturerIds = [...manufacturerIds, ...createdManufacturers];
                console.log(
                    'Manufacturers| Added',
                    createdManufacturers.map((m) => m.name).join(', ')
                );
            }
            product.manufacturers = manufacturerIds;

            console.log('Dimensions| Adding...', productDimensions);
            productDimensions.updated_by =
                event.headers.AuthorizedUserId ??
                event.headers.authorizeduserid;
            productDimensions = await transactionalEntityManager
                .getRepository(Dimension)
                .save(productDimensions);
            console.log('Dimensions| Added');
            product.dimensions = productDimensions;

            if (connections) {
                if (connections.length > 0) {
                    if (product.product_type.name === 'Device') {
                        product.connections = connections.map(
                            (acc) => new Product(acc)
                        );
                    } else {
                        product.connections = [];
                    }
                } else {
                    product.connections = [];
                }
            }

            console.log(`Product| Saving...`, product);
            product.updated_by =
                event.headers.AuthorizedUserId ??
                event.headers.authorizeduserid;
            product = await transactionalEntityManager
                .getRepository(Product)
                .save(product);
            console.log(`Product| Saved Product[${product.id}]`);

            await transactionalEntityManager.query(
                `
                    DELETE FROM "product_connections_product" WHERE "accessory" = $1
                `,
                [product.id]
            );
            if (connections.length > 0 && !product.connections) {
                const connectionsToSave = await setupExternalConnections(
                    transactionalEntityManager,
                    product?.id ?? 0,
                    connections
                );

                if (connectionsToSave?.length > 0) {
                    console.log('Connections| Saving...', connectionsToSave);
                    await Promise.all(
                        connectionsToSave.map(async (con) => {
                            await transactionalEntityManager.query(
                                `
                                    insert into "product_connections_product" (product, accessory)
                                    values ($1, $2)
                                    `,
                                [con.id, product.id]
                            );
                        })
                    );
                    console.log('Connections| Saved');
                }
            }

            const existingImages = await dbConn
                .createQueryBuilder(ProductImage, 'pimg')
                .innerJoinAndSelect('pimg.product', 'p')
                .where('p.id = :productId', { productId: product.id })
                .getMany();

            const imageData = prepareImageData(
                event.body.productImages,
                existingImages
            );
            const {
                imagesToDelete,
                imagesToReplace,
                imagesToShift,
                imagesToCreate,
            } = imageData;

            console.log('Images| Removing...', imagesToDelete);
            const removedS3Imgs = await removeImages(
                product?.id ?? 0,
                imagesToDelete,
                bucket ?? ''
            );
            removedS3Imgs.length > 0
                ? await transactionalEntityManager
                      .getRepository(ProductImage)
                      .save(removedS3Imgs)
                : [];
            console.log('Images| Removed');

            const changedImages = await addImages(
                product?.id ?? 0,
                [...imagesToReplace, ...imagesToShift],
                bucket ?? ''
            );

            const updatedImages = changedImages
                .filter((img) => Number(img.id))
                .map((img) =>
                    Object.assign(new ProductImage(), {
                        id: img.id,
                        bucket: bucket,
                        key: img.key,
                        region: img.region,
                        order: img.order,
                        product: product,
                        s3VersionId: img.versionId,
                        updated_by: event.headers.authorizeduserid,
                    })
                );
            console.log('Images| Updating...', updatedImages);
            imagesToReplace.length > 0 || imagesToShift.length > 0
                ? await transactionalEntityManager
                      .getRepository(ProductImage)
                      .save(updatedImages)
                : [];
            console.log('Images| Updated');

            const createdImages =
                imagesToCreate.length > 0
                    ? await Promise.all(
                          imagesToCreate.map(async (img) => {
                              const toSave = Object.assign(new ProductImage(), {
                                  bucket: bucket,
                                  region: img.region,
                                  order: img.order,
                                  product: product,
                                  created_by: event.headers.authorizeduserid,
                                  updated_by: event.headers.authorizeduserid,
                              });
                              const result = await transactionalEntityManager
                                  .getRepository(ProductImage)
                                  .save(toSave);

                              return {
                                  id: result.id,
                                  key: `images/${result.id}`,
                                  bucket: bucket,
                                  region: img.region,
                                  order: img.order,
                                  product: product,
                                  image: img.image,
                                  mime: img.mime,
                              };
                          })
                      )
                    : [];

            const uploadedImages = await addImages(
                product?.id ?? 0,
                [...createdImages],
                bucket ?? ''
            );
            const updateCreatedImage = uploadedImages
                .filter((img) => Number(img.id))
                .map((img) =>
                    Object.assign(new ProductImage(), {
                        id: img.id,
                        bucket: bucket,
                        key: img.key,
                        region: img.region,
                        order: img.order,
                        product: product.id,
                        s3VersionId: img.versionId,
                        updated_by: event.headers.authorizeduserid,
                    })
                );

            console.log('Images| Adding...', updateCreatedImage);
            updateCreatedImage.length > 0
                ? await transactionalEntityManager
                      .getRepository(ProductImage)
                      .save(updateCreatedImage)
                : [];
            console.log('Images| Added');

            console.log('*** FINISH TRANSACTION ***');
        })
        .catch((err) => {
            console.log(err);
            throw new AppError(err, 400);
        });
    console.log(`Product[${product.id ?? 'ERROR'}| End`);

    return product;
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
    event,
    context
) => {
    console.log(event);
    return await handleTimeout(task(event), context);
};

export const main = middyfy(handler);
