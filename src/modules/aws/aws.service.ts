import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";
import { KendraClient } from "@aws-sdk/client-kendra";
import { S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AWSService {
  public s3Client = new S3Client();
  public kendraClient = new KendraClient();
  public bedrockClient = new BedrockRuntimeClient({ region: "us-west-2" });
}
