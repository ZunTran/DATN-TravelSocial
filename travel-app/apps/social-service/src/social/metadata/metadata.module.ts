import { Module } from '@nestjs/common';
import { CategoryRepository } from './category/category.repository';
import { LocationRepository } from './location/location.repository';
import { HashtagRepository } from './hashtag/hashtag.repository';
import { CategoryService } from './category/category.service';
import { LocationService } from './location/location.service';
import { HashtagService } from './hashtag/hashtag.service';
import { MetadataResolver } from './metadata.resolver';

@Module({
  providers: [
    MetadataResolver,
    CategoryRepository,
    LocationRepository,
    HashtagRepository,
    CategoryService,
    LocationService,
    HashtagService

  ],
  exports: [
    CategoryRepository,
    LocationRepository,
    HashtagRepository,
    CategoryService,
    LocationService,
    HashtagService
  ],
})
export class MetadataModule {}