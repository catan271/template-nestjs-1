import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class DownloadFileQuery {
  @ApiProperty()
  @IsString()
  path: string;
}
