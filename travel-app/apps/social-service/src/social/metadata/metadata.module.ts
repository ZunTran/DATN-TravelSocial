import { Module } from '@nestjs/common';
import { CategoryRepository } from './category/category.repository';
import { LocationRepository } from './location/location.repository';
import { HashtagRepository } from './hashtag/hashtag.repository';
import { CategoryService } from './category/category.service';
import { LocationService } from './location/location.service';
import { HashtagService } from './hashtag/hashtag.service';
import { MetadataResolver } from './metadata.resolver';
import { CategoryResolver } from './category/category.resolver';

@Module({
  providers: [
    MetadataResolver,
    LocationRepository,
    HashtagRepository,
    LocationService,
    HashtagService,
CategoryResolver,
  CategoryService,
  CategoryRepository
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