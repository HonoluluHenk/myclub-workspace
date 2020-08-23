import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClubScheduleScraper } from "./scraper/club-schedule-scraper";
import { ScheduleController } from "./schedule/schedule.controller";

@Module({
  imports: [],
  controllers: [AppController, ScheduleController],
  providers: [AppService, ClubScheduleScraper],
})
export class AppModule {}
