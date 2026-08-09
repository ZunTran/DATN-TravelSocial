import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { graphqlUploadExpress } from 'graphql-upload-ts';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Setup Validation cho DTO (cái này cực quan trọng)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.use(graphqlUploadExpress({ maxFileSize: 10 * 1024 * 1024, maxFiles: 5 }));
  const port = process.env.PORT || 3002;
  await app.listen(port);
  
  Logger.log(`🚀 User Service đang chạy tại: http://localhost:${port}/graphql`);
}
bootstrap();