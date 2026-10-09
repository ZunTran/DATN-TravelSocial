import {
  Inject,
  Injectable,
} from '@nestjs/common';

import { ClientProxy } from '@nestjs/microservices';
import {PostLikedEvent} from './social-event.types';
import { POST_LIKED_EVENT, POST_PUBLISHED_EVENT } from './event.constants';

@Injectable()
export class SocialEventPublisher {
  constructor(
    @Inject('SOCIAL_EVENT_BUS')
    private readonly client: ClientProxy,
  ) {}

  async publishPostLiked(
    event: PostLikedEvent,
  ): Promise<void> {
    await this.client.emit(
      POST_LIKED_EVENT,
      event,
    ).toPromise();
  }

  async publishPostPublished(
    event: PostLikedEvent,
  ): Promise<void> {
    await this.client.emit(
      POST_PUBLISHED_EVENT,
      event,
    ).toPromise();
  }
}