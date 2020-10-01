import {Module} from '@nestjs/common';

import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ScheduleController} from './schedule/schedule.controller';
import {ScraperModule} from './scraper/scraper.module';

@Module({
  imports: [
    // MongooseCoreModule.forRoot(environment.mongodbUrl, {
    //   useNewUrlParser: true,
    //   useCreateIndex: true,
    //   useUnifiedTopology: true,
    // }),
    ScraperModule,
  ],
  controllers: [AppController, ScheduleController],
  providers: [AppService],
})
export class AppModule {
}
