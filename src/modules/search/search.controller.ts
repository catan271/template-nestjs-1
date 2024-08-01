import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SearchService } from "./search.service";
import { SearchBody } from "./dto/search-body.dto";

@Controller("search")
@ApiTags("search")
export class SearchController {
  constructor(private service: SearchService) {}

  @Post("/")
  async search(@Body() body: SearchBody) {
    return this.service.search(body);
  }

  @Post("/stream")
  async streamingSearch(@Body() body: SearchBody) {
    return this.service.streamingSearch(body);
  }
}
