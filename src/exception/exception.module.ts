import { Module } from "@nestjs/common";
import { UncaughtExceptionFilter } from "./filters/UncaughtException.filter";
import { UnauthorizedExceptionFilter } from "./filters/UnauthorizedException.filter";
import { HttpExceptionFilter } from "./filters/HttpException.filter";

@Module({
  providers: [UncaughtExceptionFilter, UnauthorizedExceptionFilter, HttpExceptionFilter],
  exports: [UncaughtExceptionFilter, UnauthorizedExceptionFilter, HttpExceptionFilter],
})
export class ExceptionModule {}
