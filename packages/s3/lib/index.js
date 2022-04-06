"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addImages = exports.removeImages = exports.prepareImageData = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const common_1 = require("@medii/common");
const FileType = require('file-type');
const aws_sdk_1 = require("aws-sdk");
let s3Parameters;
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
}
else {
    s3Parameters = {
        region: 'ap-southeast-2',
    };
}
const s3Client = new client_s3_1.S3Client(s3Parameters);
exports.prepareImageData = (imageList, existingImages) => {
    const imagesToDelete = (imageList === null || imageList === void 0 ? void 0 : imageList.length) > 0
        ? existingImages.filter((existingImage) => !imageList
            .filter((img) => Number(img.id))
            .map((img) => Number(img.id))
            .includes(existingImage.id))
        : existingImages;
    const imagesToReplace = (imageList === null || imageList === void 0 ? void 0 : imageList.length) > 0
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
    const imagesToShift = (imageList === null || imageList === void 0 ? void 0 : imageList.length) > 0
        ? imageList
            .filter((img) => Number(img.id))
            .filter(({ id: id1, order: order1 }) => existingImages.some(({ id: id2, order: order2 }) => id2 === id1 && order1 !== order2))
            .filter((existingImage) => !imagesToReplace
            .filter((img) => Number(img.id))
            .map((img) => Number(img.id))
            .includes(Number(existingImage.id)))
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
    const imagesToCreate = (imageList === null || imageList === void 0 ? void 0 : imageList.length) > 0
        ? imageList
            .filter((img) => !Number(img.id))
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
exports.removeImages = (id, filesToDelete, bucket) => __awaiter(void 0, void 0, void 0, function* () {
    const getExistingObjects = yield Promise.all(filesToDelete.map((file) => __awaiter(void 0, void 0, void 0, function* () {
        const retrievedFile = yield Storage.get(
        //file.bucket ?? bucket,
        bucket, `${id}/${file.key}`);
        return retrievedFile;
    })));
    if (getExistingObjects.length != filesToDelete.length) {
        throw new common_1.AppError(`Invalid keys provided, found: ${getExistingObjects}, provided: ${filesToDelete}`, 400);
    }
    const deletedObjects = yield Promise.all(filesToDelete.map((file) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const deletedFile = yield Storage.remove(
        //file.bucket ?? bucket,
        bucket, `${id}/${file.key}`);
        file.s3VersionId = (_a = deletedFile === null || deletedFile === void 0 ? void 0 : deletedFile.VersionId) !== null && _a !== void 0 ? _a : '';
        file.deleted_date = new Date();
        return file;
    })));
    return deletedObjects;
});
exports.addImages = (id, fileList, bucket) => __awaiter(void 0, void 0, void 0, function* () {
    const fixedImageData = fileList.map((file) => {
        let imageFile = file;
        if (imageFile.image.substr(0, 10) === 'data:image') {
            imageFile.image = imageFile.image.substr(imageFile.image.indexOf(';') + 1);
        }
        if (imageFile.image.substr(0, 7) === 'base64,') {
            imageFile.image = imageFile.image.substr(7);
        }
        return imageFile;
    });
    const uploadResults = yield Promise.all(fixedImageData.map((imageData) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        const buffer = Buffer.from(imageData.image, 'base64');
        const fileInfo = yield FileType.fromBuffer(buffer);
        const detectedMime = fileInfo.mime;
        if (detectedMime !== imageData.mime) {
            console.log(`Mime types don't match [${detectedMime}, ${imageData.mime}]`);
            throw new common_1.AppError(`Mime types don't match [${detectedMime}, ${imageData.mime}]`);
        }
        const writeResults = yield Storage.write(buffer, `${id}/${imageData.key}`, 
        //imageData.bucket ?? bucket,
        bucket, null, imageData.mime.toString());
        imageData.versionId = (_b = writeResults === null || writeResults === void 0 ? void 0 : writeResults.VersionId) !== null && _b !== void 0 ? _b : '';
        return imageData;
    })));
    return uploadResults;
});
let legacyS3Client;
if (process.env.IS_OFFLINE) {
    legacyS3Client = new aws_sdk_1.S3({
        s3ForcePathStyle: true,
        accessKeyId: 'S3RVER',
        secretAccessKey: 'S3RVER',
        endpoint: new aws_sdk_1.Endpoint('http://localhost:4569'),
    });
}
else {
    legacyS3Client = new aws_sdk_1.S3();
}
const Storage = {
    // TODO - S.Y: Convert to new aws-sdk v3 when this issue is resolved: https://github.com/aws/aws-sdk-js-v3/issues/1877
    get(bucket, fileName, region = 'ap-southeast-2') {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                Bucket: bucket,
                Key: fileName,
            };
            legacyS3Client.config.region = region;
            let data = yield legacyS3Client.getObject(params).promise();
            if (!data) {
                throw new common_1.AppError(`Failed to get file ${fileName}, from ${bucket}`);
            }
            if (fileName.slice(fileName.length - 4, fileName.length) == 'json') {
                return (_a = data === null || data === void 0 ? void 0 : data.Body) === null || _a === void 0 ? void 0 : _a.toString();
            }
            return data;
        });
    },
    write(data, fileName, bucket, ACL, ContentType) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Writing to ${bucket}/${fileName}`);
            const putObjectInput = {
                Bucket: bucket,
                Body: Buffer.isBuffer(data) ? data : JSON.stringify(data),
                Key: fileName,
                ACL,
                ContentType,
            };
            const putObjectCommand = new client_s3_1.PutObjectCommand(putObjectInput);
            const newData = yield s3Client.send(putObjectCommand);
            if (!newData) {
                throw new common_1.AppError(`There was an error writing file to S3 - ${bucket}/${fileName}`);
            }
            return newData;
        });
    },
    getSignedUrl(bucket, fileName, expirySeconds) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO - S.Y: Work out how to change region for new AWS-SDK setup
            // s3Client.config.region = region;
            const getObjectInput = {
                Bucket: bucket,
                Key: fileName,
            };
            const getObjectCommand = new client_s3_1.GetObjectCommand(getObjectInput);
            return yield s3_request_presigner_1.getSignedUrl(s3Client, getObjectCommand, {
                expiresIn: expirySeconds,
            });
        });
    },
    remove(bucket, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteObjectInput = {
                Bucket: bucket,
                Key: fileName,
            };
            const deleteObjectCommand = new client_s3_1.DeleteObjectCommand(deleteObjectInput);
            const data = yield s3Client.send(deleteObjectCommand);
            if (!data) {
                throw new common_1.AppError(`Failed to delete file ${fileName}, from ${bucket}`);
            }
            return data;
        });
    },
};
exports.default = Storage;
