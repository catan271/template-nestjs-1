import { Body, Controller, Delete, Get, Param, Post, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileService } from "./file.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { UploadFileBody, uploadFilePipe } from "./dto/upload-file-body.dto";
import { DownloadFileParam as DownloadFileParam } from "./dto/download-file-query";
import { Response } from "express";
import { DeleteFileBody } from "./dto/delete-file-body.dto";

@Controller("files")
@ApiTags("files")
export class FileController {
  constructor(private service: FileService) {}

  @Post("/upload")
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  async upload(@Body() body: UploadFileBody, @UploadedFile(uploadFilePipe) file: Express.Multer.File) {
    return this.service.upload(body, file);
  }

  @Get("/")
  async list() {
    return this.service.list();
  }

  @Get("/download/:key")
  async download(@Res() res: Response, @Param() param: DownloadFileParam) {
    return this.service.download(res, param);
  }

  @Delete("/")
  async delete(@Body() body: DeleteFileBody) {
    return this.service.delete(body);
  }
}
