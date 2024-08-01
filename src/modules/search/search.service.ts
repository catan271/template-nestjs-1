import { Injectable } from "@nestjs/common";
import { AWSService } from "../aws/aws.service";
import { SearchBody } from "./dto/search-body.dto";
import { QueryCommand } from "@aws-sdk/client-kendra";
import { ConfigService } from "@nestjs/config";
import { ContentBlock, ConverseCommand, ConverseStreamCommand, DocumentFormat } from "@aws-sdk/client-bedrock-runtime";
import { parse } from "path";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { omit } from "lodash";

@Injectable()
export class SearchService {
  constructor(
    private configService: ConfigService,
    private awsService: AWSService,
  ) {}
  async _queryFiles(queryText: string) {
    const bucket = this.configService.get("AWS_S3_BUCKET");

    const kendraRes = await this.awsService.kendraClient.send(
      new QueryCommand({
        IndexId: "26ff0599-d262-4fea-9ff6-c11b7e129508",
        QueryText: queryText,
      }),
    );

    kendraRes.ResultItems ??= [];
    const files = await kendraRes.ResultItems.slice(0, 3).mapAsync(async (item) => {
      const key = item.DocumentId!.slice(`s3://${bucket}/`.length);
      const { Body } = await this.awsService.s3Client.send(
        new GetObjectCommand({
          Bucket: bucket,
          Key: key,
        }),
      );
      const bytes = await Body!.transformToByteArray();
      const parsedName = parse(key);
      return {
        key,
        bytes,
        name: parsedName.name,
        ext: parsedName.ext,
      };
    });

    return files;
  }

  async search(body: SearchBody) {
    const files = await this._queryFiles(body.text);

    const bedrockRes = await this.awsService.bedrockClient.send(
      new ConverseCommand({
        modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
        messages: [
          {
            role: "user",
            content: [
              { text: body.text },
              ...files.map<ContentBlock.DocumentMember>((file) => ({
                document: {
                  format: file.ext.slice(1) as DocumentFormat,
                  name: file.name
                    .trim()
                    .replace(/\s+/g, " ")
                    .replace(/[^A-Za-z0-9\-\(\)\[\]]/g, "-"),
                  source: { bytes: file.bytes },
                },
              })),
            ],
          },
        ],
      }),
    );

    console.log("token:", bedrockRes.usage);

    return {
      text: bedrockRes.output!.message!.content![0].text,
      documents: files.map((file) => omit(file, "bytes")),
    };
  }

  async streamingSearch(body: SearchBody) {
    const files = await this._queryFiles(body.text);

    const bedrockRes = await this.awsService.bedrockClient.send(
      new ConverseStreamCommand({
        modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
        messages: [
          {
            role: "user",
            content: [
              { text: body.text },
              ...files.map<ContentBlock.DocumentMember>((file) => ({
                document: {
                  format: file.ext.slice(1) as DocumentFormat,
                  name: file.name
                    .trim()
                    .replace(/\s+/g, " ")
                    .replace(/[^A-Za-z0-9\-\(\)\[\]]/g, "-"),
                  source: { bytes: file.bytes },
                },
              })),
            ],
          },
        ],
      }),
    );

    let text = "";
    for await (const item of bedrockRes.stream!) {
      if (item.contentBlockDelta?.delta?.text) {
        text += item.contentBlockDelta?.delta?.text;
      }
    }

    return {
      text,
      documents: files.map((file) => omit(file, "bytes")),
    };
  }
}
