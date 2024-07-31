import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { LoggerModule } from "./logger/logger.module";
import { ExceptionModule } from "./exception/exception.module";
import { FileModule } from "./modules/file/file.module";
import { CronModule } from "./modules/cron/cron.module";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule,
    ExceptionModule,
    ScheduleModule.forRoot(),
    CronModule,
    FileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
