import {Module} from '@nestjs/common';
import {ScraperController} from './scraper.controller';

@Module({
  imports: [],
  controllers: [ScraperController],
  providers: [],
  exports: [],
})
export class ScraperModule {
}
