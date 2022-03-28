import {
    DeleteObjectCommand,
    DeleteObjectCommandInput,
    DeleteObjectCommandOutput,
    GetObjectCommand,
    GetObjectCommandInput,
    // GetObjectCommandOutput,
    PutObjectCommand,
    PutObjectCommandInput,
    PutObjectCommandOutput,
    S3Client,
    S3ClientConfig,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ImageEntity } from '../../libs/entities/utils/ImageEntity';
import { AppError } from '../../libs/shared/appError';
const FileType = require('file-type');

import { S3, Endpoint } from 'aws-sdk';

let s3Parameters: S3ClientConfig;
if (process.env.IS_OFFLINE) {
    s3Parameters = {
        forcePathStyle: true,
        credentials: {
            accessKeyId: 'S3RVER',
            secretAccessKey: 'S3RVER',
        },
        endpoint: 'http://localhost:4569',
        region: 'ap-southeast-2',
    };
} else {
    s3Parameters = {
        region: 'ap-southeast-2',
    };
}
const s3Client = new S3Client(s3Parameters);

export interface ImageInfo {
    id: number;
    bucket: string;
    key: string;
    region: string;
    order: number;
    image: string;
    mime: string;
    versionId: string;
}

export const prepareImageData = (imageList, existingImages: ImageEntity[]) => {
    const imagesToDelete =
        imageList?.length > 0
            ? existingImages.filter(
                  (existingImage) =>
                      !imageList
                          .filter((img) => Number(img.id))
                          .map((img) => Number(img.id))
                          .includes(existingImage.id)
              )
            : existingImages;

    const imagesToReplace =
        imageList?.length > 0
            ? imageList
                  .filter((img) => Number(img.id))
                  .filter((img) => img.updated)
                  .map((img) => ({
                      id: img.id,
                      bucket: img.bucket,
                      key: `images/${img.id}`,
                      region: img.region,
                      order: img.order,
                      image: img.image,
                      mime: img.mime,
                  }))
            : [];

    const imagesToShift =
        imageList?.length > 0
            ? imageList
                  .filter((img) => Number(img.id))
                  .filter(({ id: id1, order: order1 }) =>
                      existingImages.some(
                          ({ id: id2, order: order2 }) =>
                              id2 === id1 && order1 !== order2
                      )
                  )
                  .filter(
                      (existingImage) =>
                          !imagesToReplace
                              .filter((img) => Number(img.id))
                              .map((img) => Number(img.id))
                              .includes(Number(existingImage.id))
                  )
                  .map((img) => ({
                      id: img.id,
                      bucket: img.bucket,
                      key: `images/${img.id}`,
                      region: img.region,
                      order: img.order,
                      image: img.image,
                      mime: img.mime,
                  }))
            : [];

    const imagesToCreate =
        imageList?.length > 0
            ? imageList
                  .filter((img: { id: any }) => !Number(img.id))
                  .map((img) => ({
                      bucket: img.bucket,
                      region: img.region,
                      order: img.order,
                      image: img.image,
                      mime: img.mime,
                  }))
            : [];
    return { imagesToDelete, imagesToReplace, imagesToShift, imagesToCreate };
};

export const removeImages = async (
    id: number,
    filesToDelete: ImageEntity[],
    bucket: string
): Promise<ImageEntity[]> => {
    const getExistingObjects = await Promise.all(
        filesToDelete.map(async (file: ImageEntity) => {
            const retrievedFile = await Storage.get(
                //file.bucket ?? bucket,
                bucket,
                `${id}/${file.key}`
            );
            return retrievedFile;
        })
    );

    if (getExistingObjects.length != filesToDelete.length) {
        throw new AppError(
            `Invalid keys provided, found: ${getExistingObjects}, provided: ${filesToDelete}`,
            400
        );
    }

    const deletedObjects = await Promise.all(
        filesToDelete.map(async (file: ImageEntity) => {
            const deletedFile = await Storage.remove(
                //file.bucket ?? bucket,
                bucket,
                `${id}/${file.key}`
            );
            file.s3VersionId = deletedFile.VersionId;
            file.deleted_date = new Date();
            return file;
        })
    );
    return deletedObjects;
};

export const addImages = async (
    id: number,
    fileList: any[],
    bucket: string
): Promise<ImageInfo[]> => {
    const fixedImageData = fileList.map((file) => {
        let imageFile = file;
        if (imageFile.image.substr(0, 10) === 'data:image') {
            imageFile.image = imageFile.image.substr(
                imageFile.image.indexOf(';') + 1
            );
        }
        if (imageFile.image.substr(0, 7) === 'base64,') {
            imageFile.image = imageFile.image.substr(7);
        }
        return imageFile;
    });

    const uploadResults = await Promise.all(
        fixedImageData.map(async (imageData: ImageInfo) => {
            const buffer = Buffer.from(imageData.image, 'base64');
            const fileInfo = await FileType.fromBuffer(buffer);
            const detectedMime = fileInfo.mime;

            if (detectedMime !== imageData.mime) {
                console.log(
                    `Mime types don't match [${detectedMime}, ${imageData.mime}]`
                );
                throw new AppError(
                    `Mime types don't match [${detectedMime}, ${imageData.mime}]`
                );
            }
            const writeResults = await Storage.write(
                buffer,
                `${id}/${imageData.key}`,
                //imageData.bucket ?? bucket,
                bucket,
                null,
                imageData.mime.toString()
            );
            imageData.versionId = writeResults.VersionId;
            return imageData;
        })
    );
    return uploadResults;
};

let legacyS3Client: S3;
if (process.env.IS_OFFLINE) {
    legacyS3Client = new S3({
        s3ForcePathStyle: true,
        accessKeyId: 'S3RVER', // This specific key is required when working offline
        secretAccessKey: 'S3RVER',
        endpoint: new Endpoint('http://localhost:4569'),
    });
} else {
    legacyS3Client = new S3();
}

const Storage = {
    // TODO - S.Y: Convert to new aws-sdk v3 when this issue is resolved: https://github.com/aws/aws-sdk-js-v3/issues/1877
    async get(
        bucket: string,
        fileName: string,
        region: string = 'ap-southeast-2'
    ) {
        const params = {
            Bucket: bucket,
            Key: fileName,
        };
        legacyS3Client.config.region = region;
        let data = await legacyS3Client.getObject(params).promise();

        if (!data) {
            throw new AppError(
                `Failed to get file ${fileName}, from ${bucket}`
            );
        }

        if (fileName.slice(fileName.length - 4, fileName.length) == 'json') {
            return data?.Body?.toString();
        }
        return data;

        // TODO - S.Y: Work out how to change region for new AWS-SDK setup
        // s3Client.config.region = region;
        // const getObjectInput: GetObjectCommandInput = {
        //     Bucket: bucket,
        //     Key: fileName,
        // };
        // const getObjectCommand = new GetObjectCommand(getObjectInput);
        // const data = await s3Client.send(getObjectCommand);

        // const body: Readable | undefined = data.Body as Readable | undefined;
        // if (!body) return;
        // const payload = await body.read();
        // return Buffer.from(payload).toString();
    },

    async write(
        data: any,
        fileName: string,
        bucket: string,
        ACL: any,
        ContentType: string
    ): Promise<PutObjectCommandOutput> {
        console.log(`Writing to ${bucket}/${fileName}`);
        const putObjectInput: PutObjectCommandInput = {
            Bucket: bucket,
            Body: Buffer.isBuffer(data) ? data : JSON.stringify(data),
            Key: fileName,
            ACL,
            ContentType,
        };
        const putObjectCommand = new PutObjectCommand(putObjectInput);
        const newData = await s3Client.send(putObjectCommand);

        if (!newData) {
            throw new AppError(
                `There was an error writing file to S3 - ${bucket}/${fileName}`
            );
        }
        return newData;
    },

    async getSignedUrl(
        bucket: string,
        fileName: string,
        expirySeconds: number
    ): Promise<string> {
        // TODO - S.Y: Work out how to change region for new AWS-SDK setup
        // s3Client.config.region = region;
        const getObjectInput: GetObjectCommandInput = {
            Bucket: bucket,
            Key: fileName,
        };
        const getObjectCommand = new GetObjectCommand(getObjectInput);
        return await getSignedUrl(s3Client, getObjectCommand, {
            expiresIn: expirySeconds,
        });
    },

    async remove(
        bucket: string,
        fileName: string
    ): Promise<DeleteObjectCommandOutput> {
        const deleteObjectInput: DeleteObjectCommandInput = {
            Bucket: bucket,
            Key: fileName,
        };
        const deleteObjectCommand = new DeleteObjectCommand(deleteObjectInput);
        const data = await s3Client.send(deleteObjectCommand);

        if (!data) {
            throw new AppError(
                `Failed to delete file ${fileName}, from ${bucket}`
            );
        }
        return data;
    },
};
export default Storage;
