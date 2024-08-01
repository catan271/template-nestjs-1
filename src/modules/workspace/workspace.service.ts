import { Injectable } from "@nestjs/common";
import { AWSService } from "../aws/aws.service";
import { CreateIndexCommand } from "@aws-sdk/client-kendra";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class WorkspaceService {
  constructor(
    private awsService: AWSService,
    private configService: ConfigService,
  ) {}

  async create() {
    const workspace = {
      id: 1,
      indexId: "",
    };

    const bucket = this.configService.get("AWS_S3_BUCKET");

    const [kendraRes] = await Promise.all([
      await this.awsService.kendraClient.send(
        new CreateIndexCommand({
          Name: `sta-workspace-${workspace.id}`,
          RoleArn: this.configService.get("AWS_ROLE_ARN"),
        }),
      ),
      await this.awsService.s3Client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: `sta-workspace-${workspace.id}/`,
          Body: new Uint8Array(),
        }),
      ),
    ]);
    workspace.indexId = kendraRes.Id!;

    return workspace;
  }
}
