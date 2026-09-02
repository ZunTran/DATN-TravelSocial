import {
  Inject,
  Injectable,
} from '@nestjs/common';

import {
  ClientProxy,
} from '@nestjs/microservices';

import {
  RABBITMQ_SERVICE,
  USER_REGISTERED_EVENT,
  UserRegisteredEvent,
} from './event.constants';

@Injectable()
export class EventsService {
  constructor(
    @Inject(RABBITMQ_SERVICE)
    private readonly client: ClientProxy,
  ) {}

  publishUserRegistered(
    event: UserRegisteredEvent,
  ): void {
    this.client.emit(
      USER_REGISTERED_EVENT,
      event,
    );
  }
}