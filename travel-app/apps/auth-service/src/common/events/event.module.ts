import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import {
  RABBITMQ_SERVICE,
} from './event.constants';
import { EventsService } from './event.service';



@Module({
  imports: [
    ClientsModule.register([
      {
        name: RABBITMQ_SERVICE,

        transport: Transport.RMQ,

        options: {
          urls: [
            process.env.RABBITMQ_URL ||
              'amqp://guest:guest@localhost:5672',
          ],

          queue:
            process.env.RABBITMQ_QUEUE ||
            'travel_user_events',

          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],

  providers: [
    EventsService,
  ],

  exports: [
    EventsService,
  ],
})
export class EventsModule {}