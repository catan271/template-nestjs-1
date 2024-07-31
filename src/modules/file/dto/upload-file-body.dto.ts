import { FileTypeValidator, MaxFileSizeValidator, ParseFilePipe } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Allow } from "class-validator";
import { mbToBytes } from "../../../utils/mb-to-bytes.util";
import { fileExceptionFactory } from "../../../exception/factories/file-exception.factory";

export class UploadFileBody {
  @ApiProperty({ type: "file" })
  @Allow()
  file: any;
}

export const uploadFilePipe = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({ maxSize: mbToBytes(14) }),
    new FileTypeValidator({ fileType: /pdf|html|xml|xslt|md|csv|xlsx|json|ppt|docx|txt/i }),
  ],
  exceptionFactory: fileExceptionFactory,
});
