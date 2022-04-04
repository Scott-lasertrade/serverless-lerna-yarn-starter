import { DeleteObjectCommandOutput, PutObjectCommandOutput } from '@aws-sdk/client-s3';
import { ImageEntity } from '@medii/data';
import { S3 } from 'aws-sdk';
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
export declare const prepareImageData: (imageList: any, existingImages: ImageEntity[]) => {
    imagesToDelete: ImageEntity[];
    imagesToReplace: any;
    imagesToShift: any;
    imagesToCreate: any;
};
export declare const removeImages: (id: number, filesToDelete: ImageEntity[], bucket: string) => Promise<ImageEntity[]>;
export declare const addImages: (id: number, fileList: any[], bucket: string) => Promise<ImageInfo[]>;
declare const Storage: {
    get(bucket: string, fileName: string, region?: string): Promise<string | import("aws-sdk/lib/request").PromiseResult<S3.GetObjectOutput, import("aws-sdk").AWSError> | undefined>;
    write(data: any, fileName: string, bucket: string, ACL: any, ContentType: string): Promise<PutObjectCommandOutput>;
    getSignedUrl(bucket: string, fileName: string, expirySeconds: number): Promise<string>;
    remove(bucket: string, fileName: string): Promise<DeleteObjectCommandOutput>;
};
export default Storage;
//# sourceMappingURL=index.d.ts.map