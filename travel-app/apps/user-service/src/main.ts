import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Setup Validation cho DTO (cái này cực quan trọng)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = process.env.PORT || 3002;
  await app.listen(port);
  
  Logger.log(`🚀 User Service đang chạy tại: http://localhost:${port}/graphql`);
}
bootstrap();