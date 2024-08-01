import { DeleteObjectCommand, GetObjectCommand, ListObjectsCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DownloadFileParam } from "./dto/download-file-query";
import { Response } from "express";
import { DeleteFileBody } from "./dto/delete-file-body.dto";
import { AWSService } from "../aws/aws.service";
import { UploadFileBody } from "./dto/upload-file-body.dto";
import { parse } from "path";

@Injectable()
export class FileService {
  private bucket;

  constructor(
    private configService: ConfigService,
    private awsService: AWSService,
  ) {
    this.bucket = this.configService.get("AWS_S3_BUCKET");
  }

  async upload(body: UploadFileBody, file: Express.Multer.File) {
    file.originalname = Buffer.from(file.originalname, "latin1").toString("utf8");
    const parsedName = parse(file.originalname);
    const keyName = `${parsedName.name}-${new Date().getTime()}${parsedName.ext}`;

    await this.awsService.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Body: file.buffer,
        Key: `sta-workspace-1/${keyName}`,
      }),
    );
  }

  async list() {
    const data = await this.awsService.s3Client.send(
      new ListObjectsCommand({
        Bucket: this.bucket,
        Prefix: "sta-workspace-1/",
      }),
    );

    data.Contents ??= [];

    return data.Contents.map((obj) => ({
      key: obj.Key,
      filename: obj.Key!.slice("sta-workspace-1/".length),
      size: obj.Size!,
      lastModified: obj.LastModified!,
    }));
  }

  async download(res: Response, params: DownloadFileParam) {
    // TODO: validate auth

    const data = await this.awsService.s3Client.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: params.key,
      }),
    );

    if (data.ContentDisposition) res.setHeader("Content-Deposition", data.ContentDisposition);
    if (data.ContentType) res.setHeader("Content-Type", data.ContentType);
    //@ts-ignore
    data.Body?.pipe(res);
  }

  async delete(body: DeleteFileBody) {
    // TODO: validate auth

    await this.awsService.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: body.key,
      }),
    );
  }
}
