import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleController } from "./schedule/schedule.controller";

@Module({
  imports: [],
  controllers: [AppController, ScheduleController],
  providers: [AppService],
})
export class AppModule {}
