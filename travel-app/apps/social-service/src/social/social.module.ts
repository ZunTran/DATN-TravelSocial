import { Module } from '@nestjs/common';
import { CloudinaryModule } from '../common/cloudinary/cloudinary.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../common/auth/strategies/jwt.strategy';
import { AdminModule } from './admin/admin.module';
import { UserProfileClientModule } from '../common/clients/user-profile/user-profile.module';
import { PostModule } from './post/post.module';
import { MetadataModule } from './metadata/metadata.module';
import { InteractionModule } from './interaction/interaction.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SocialEventPublisher } from '../common/events/social-event.publisher';

@Module({
  

  imports: [
    ClientsModule.register([
      {
        name: 'SOCIAL_EVENT_BUS',
        transport: Transport.RMQ,
        options: {
          urls: [ process.env.RABBITMQ_URL ??'amqp://localhost:5672'],
          queue: process.env.RABBITMQ_SOCIAL_QUEUE ??'social_events',
          queueOptions: { durable: true},
        },
      },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserProfileClientModule,
    AdminModule,
    CloudinaryModule,
    PostModule,
    MetadataModule,
    InteractionModule
  ],
  providers: [
    JwtStrategy, 
    SocialEventPublisher
  ],
  exports: [
    SocialEventPublisher
  ]
  
})
export class SocialModule {}