import { Module } from '@nestjs/common';
import { CategoryRepository } from './category/category.repository';
import { LocationRepository } from './location/location.repository';
import { HashtagRepository } from './hashtag/hashtag.repository';

@Module({
  providers: [
    CategoryRepository,
    LocationRepository,
    HashtagRepository,
  ],
  exports: [
    CategoryRepository,
    LocationRepository,
    HashtagRepository,
  ],
})
export class MetadataModule {}