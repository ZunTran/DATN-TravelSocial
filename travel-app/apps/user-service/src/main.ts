import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: false }));
  app.use(graphqlUploadExpress({ maxFileSize: 10 * 1024 * 1024, maxFiles: 5 }));
  app.connectMicroservice({ transport: Transport.RMQ,

    options: {
      urls: [ process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
      queue: process.env.RABBITMQ_QUEUE ||'travel_user_events',
      queueOptions: {durable: true},
    },
  });
  await app.startAllMicroservices();
  const port = process.env.PORT || 3002;
  await app.listen(port,'0.0.0.0');
  
  Logger.log(`🚀 User Service đang chạy tại: http://localhost:${port}/graphql`);
}
bootstrap();