import { forwardRef, Module } from '@nestjs/common';
import { LikeService } from './like/like.service';
import { LikeRepository } from './like/like.repository';
import { CommentService } from './comment/comment.service';
import { CommentRepository } from './comment/comment.repository';
import { SavePostService } from './save-post/save-post.service';
import { SavePostRepository } from './save-post/save-post.repository';
import { ShareService } from './share/share.service';
import { ShareRepository } from './share/share.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { UserProfileClientModule } from '../../common/clients/user-profile/user-profile.module';
import { InteractionResolver } from './interaction.resolver';
import { PostModule } from '../post/post.module';

@Module({
  imports: [
      UserProfileClientModule,
      forwardRef(() => PostModule),
    ],

  providers: [
    InteractionResolver,
    PrismaService,

    LikeService,
    LikeRepository,

    CommentService,
    CommentRepository,

    SavePostService,
    SavePostRepository,

    ShareService,
    ShareRepository,
  ],
  exports: [
    LikeService,
    SavePostService,
  ],
})
export class InteractionModule {}
