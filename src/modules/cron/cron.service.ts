import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { AppLogger } from "../../logger/logger.service";

@Injectable()
export class CronService {
  constructor(private logger: AppLogger) {}

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async handleEndMeeting() {
    this.logger.log("test cron");
  }
}
