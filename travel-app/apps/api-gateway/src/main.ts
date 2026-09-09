import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { graphqlUploadExpress } from 'graphql-upload-ts';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.use(
    graphqlUploadExpress({
      maxFileSize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
  );
  
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
});

  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');

  console.log(
    `🚀 API Gateway running at http://localhost:${port}/graphql`,
  );
}

bootstrap();