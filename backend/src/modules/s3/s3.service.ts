import { Injectable, Inject, InternalServerErrorException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand, S3ServiceException, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import s3Config from './s3.config';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(
    @Inject(s3Config.KEY)
    private config: ConfigType<typeof s3Config>,
  ) {

    // This is just temporary check for env to stop ts screaming. We can implement zod for env validation
    if(!config.accessKeyId || !config.secretAccessKey || !config.region || !config.endpoint || !config.bucketName) {
      throw new InternalServerErrorException('S3 configuration is incomplete. Please check your environment variables.');
    };
    this.bucketName = config.bucketName;
    this.s3Client = new S3Client({
      region: config.region,
      endpoint: config.endpoint,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      requestChecksumCalculation: 'WHEN_REQUIRED',
    });
  }

  async getPresignedUploadUrl(key: string, contentType: string, contentLengthInBytes: number, expiresInSeconds: number = 60): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
      ContentLength: contentLengthInBytes,
    });
    return getSignedUrl(this.s3Client, command,  { expiresIn: expiresInSeconds });
  }

  async uploadFileBuffer(buffer: Buffer, key: string, contentType: string): Promise<string> {
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: buffer,
          ContentType: contentType,
        }),
      );
      return key;
    } catch (error) {
        if (error instanceof S3ServiceException) {
            throw new InternalServerErrorException(`Failed to upload file to S3: ${error.message}`);
        } else {
            throw new InternalServerErrorException('An unexpected error occurred while uploading the file to S3.');
        }
    }
  }

  async deleteFile(key: string): Promise<void> {
    await this.s3Client.send(new DeleteObjectCommand({ Bucket: this.bucketName, Key: key }));
  }

  async getFileMetadata(key: string): Promise<{ contentType: string; contentLength: number }> {
    const headObjectCommand = new HeadObjectCommand({ Bucket: this.bucketName, Key: key });
    const response = await this.s3Client.send(headObjectCommand);
    return {
      contentType: response.ContentType || '',
      contentLength: response.ContentLength || 0,
    };
  }
}