import { Controller, Get, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DataSourceService } from "./data-source.service";

@Controller("data-source")
@ApiTags("data-source")
export class DataSourceController {
  constructor(private service: DataSourceService) {}

  @Post("/")
  async create() {
    return this.service.create();
  }

  @Get("/")
  async list() {
    return this.service.list();
  }

  @Post("/sync")
  async startSync() {
    return this.service.startSync();
  }
}
