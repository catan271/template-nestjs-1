import { Body, Controller, Delete, Get, Post, Query, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileService } from "./file.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { UploadFileBody, uploadFilePipe } from "./dto/upload-file-body.dto";
import { DownloadFileQuery } from "./dto/download-file-query";
import { Response } from "express";
import { DeleteFileBody } from "./dto/delete-file-body.dto";

@Controller("files")
@ApiTags("files")
export class FileController {
  constructor(private service: FileService) {}

  @Post("/")
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  async uploadFile(@Body() body: UploadFileBody, @UploadedFile(uploadFilePipe) file: Express.Multer.File) {
    return this.service.uploadFile(file);
  }

  @Get("/")
  async listFiles() {
    return this.service.listFiles();
  }

  @Get("/download")
  async downloadFile(@Res() res: Response, @Query() query: DownloadFileQuery) {
    return this.service.downloadFile(res, query);
  }

  @Delete("/")
  async deleteFile(@Body() body: DeleteFileBody) {
    return this.service.deleteFile(body);
  }
}
