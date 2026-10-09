import { Module } from '@nestjs/common';
import { CategoryRepository } from './category/category.repository';
import { LocationRepository } from './location/location.repository';
import { HashtagRepository } from './hashtag/hashtag.repository';
import { CategoryService } from './category/category.service';
import { LocationService } from './location/location.service';
import { HashtagService } from './hashtag/hashtag.service';
// import { MetadataResolver } from './metadata.resolver';
import { CategoryResolver } from './category/category.resolver';
import { LocationResolver } from './location/location.resolver';
import { HashtagResolver } from './hashtag/hashtag.resolver';
import { EmbeddingService } from './location/embedding.service';

@Module({
  providers: [
    // MetadataResolver,
    EmbeddingService,
    HashtagResolver,
    HashtagRepository,
    HashtagService,

    LocationResolver,
    LocationService,
    LocationRepository,


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
    HashtagService,
    EmbeddingService
  ],
})
export class MetadataModule {}