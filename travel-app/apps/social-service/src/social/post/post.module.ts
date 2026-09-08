import { PostService } from './post.service';
import { PostRepository } from './post.repository';
import { forwardRef, Module } from '@nestjs/common';
import { UserProfileClientModule } from '../../common/clients/user-profile/user-profile.module';
import { MetadataModule } from '../metadata/metadata.module';
import { PostResolver } from './post.resolver';
import { CloudinaryModule } from '../../common/cloudinary/cloudinary.module';
import { FollowClientModule } from '../../common/clients/follow/follow.module';
import { InteractionModule } from '../interaction/interaction.module';

@Module({
  imports: [
    CloudinaryModule,
    MetadataModule,
    UserProfileClientModule,
    FollowClientModule,
    forwardRef(() => InteractionModule),
  ],
  controllers: [],
  providers: [
    PostService,
    PostRepository,
    PostResolver,
  ],

  exports: [
    PostService,
    PostRepository,
  ],
  
})
export class PostModule {}
