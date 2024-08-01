import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SearchBody {
  @ApiProperty()
  @IsString()
  text: string;
}
