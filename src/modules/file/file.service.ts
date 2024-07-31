import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DownloadFileQuery } from "./dto/download-file-query";
import { Response } from "express";
import { DeleteFileBody } from "./dto/delete-file-body.dto";

@Injectable()
export class FileService {
  private clientS3 = new S3Client();
  private bucket;

  constructor(private configService: ConfigService) {
    this.bucket = this.configService.get("AWS_S3_BUCKET");
  }

  async uploadFile(file: Express.Multer.File) {
    await this.clientS3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Body: file.buffer,
        Key: `demo1/${file.originalname}`,
      }),
    );
  }

  async listFiles() {
    const data = await this.clientS3.send(
      new ListObjectsCommand({
        Bucket: this.bucket,
        Prefix: "demo1/",
      }),
    );

    return data.Contents!.map((obj) => ({
      path: obj.Key,
      filename: obj.Key!.slice("demo1/".length),
      size: obj.Size!,
      lastModified: obj.LastModified!,
    }));
  }

  async downloadFile(res: Response, query: DownloadFileQuery) {
    // TODO: validate auth

    const data = await this.clientS3.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: query.path,
      }),
    );

    res.setHeader("Content-Deposition", data.ContentDisposition!);
    res.setHeader("Content-Type", data.ContentType!);
    //@ts-ignore
    data.Body?.pipe(res);
  }

  async deleteFile(body: DeleteFileBody) {
    // TODO: validate auth

    await this.clientS3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: body.path,
      }),
    );
  }
}
