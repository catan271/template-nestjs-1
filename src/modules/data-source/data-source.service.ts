import { Injectable } from "@nestjs/common";
import { AWSService } from "../aws/aws.service";
import { CreateDataSourceCommand, ListDataSourcesCommand, StartDataSourceSyncJobCommand } from "@aws-sdk/client-kendra";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class DataSourceService {
  constructor(
    private configService: ConfigService,
    private awsService: AWSService,
  ) {}

  async create() {
    await this.awsService.kendraClient.send(
      new CreateDataSourceCommand({
        IndexId: "26ff0599-d262-4fea-9ff6-c11b7e129508",
        RoleArn: this.configService.get("AWS_ROLE_ARN"),
        Name: "default-s3",
        Type: "S3",
        LanguageCode: "en",
        Configuration: {
          S3Configuration: {
            BucketName: this.configService.get("AWS_S3_BUCKET"),
            InclusionPrefixes: [`sta-workspace-1/`],
          },
        },
        Schedule: `cron(0 * * * ? *)`,
      }),
    );
  }

  async list() {
    const data = await this.awsService.kendraClient.send(
      new ListDataSourcesCommand({
        IndexId: "26ff0599-d262-4fea-9ff6-c11b7e129508",
      }),
    );
    return data.SummaryItems!.map((item) => ({
      id: item.Id!,
      name: item.Name!,
      type: item.Type!,
      createdAt: item.CreatedAt!,
    }));
  }

  async startSync() {
    await this.awsService.kendraClient.send(
      new StartDataSourceSyncJobCommand({
        Id: "44fc37b2-bdee-4b5c-8d99-1f9731cdd8e7",
        IndexId: "26ff0599-d262-4fea-9ff6-c11b7e129508",
      }),
    );
  }
}
