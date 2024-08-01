import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { LoggerModule } from "./logger/logger.module";
import { ExceptionModule } from "./exception/exception.module";
import { FileModule } from "./modules/file/file.module";
import { CronModule } from "./modules/cron/cron.module";
import { ScheduleModule } from "@nestjs/schedule";
import { AWSModule } from "./modules/aws/aws.module";
import { WorkspaceModule } from "./modules/workspace/workspace.module";
import { DataSourceModule } from "./modules/data-source/data-source.module";
import { SearchModule } from "./modules/search/search.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule,
    ExceptionModule,
    ScheduleModule.forRoot(),
    CronModule,
    AWSModule,
    WorkspaceModule,
    FileModule,
    DataSourceModule,
    SearchModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
