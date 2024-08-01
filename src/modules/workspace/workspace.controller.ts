import { Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { WorkspaceService } from "./workspace.service";

@Controller("workspace")
@ApiTags("workspace")
export class WorkspaceController {
  constructor(private service: WorkspaceService) {}

  @Post("/")
  async create() {
    return this.service.create();
  }
}
