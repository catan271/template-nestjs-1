import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class DeleteFileBody {
  @ApiProperty()
  @IsString()
  key: string;
}
