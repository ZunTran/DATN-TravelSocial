// import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
// import { GraphQLModule } from '@nestjs/graphql';
// import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
// import { join } from 'path';

// import { AuthModule } from './auth/auth.module';
// import { PrismaModule } from './prisma/prisma.module';

// @Module({
//   imports: [
//     ConfigModule.forRoot({ isGlobal: true }),
    
//     GraphQLModule.forRoot<ApolloDriverConfig>({
//       driver: ApolloDriver,
//       autoSchemaFile:join(process.cwd(), 'src/schema.gql'),
//       sortSchema: true,
//       playground: true,
//         }),

//     PrismaModule,
//     AuthModule,
//   ],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
// import { join } from 'path';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
    //   autoSchemaFile: join(process.cwd(), 'apps/auth-service/src/schema.gql'), // Đã sửa đúng đường dẫn monorepo
      autoSchemaFile: true,
      sortSchema: true,
    //   playground: true,
      introspection: true, // Bắt buộc bật để Playground load schema không bị lỗi
    }),

    PrismaModule,
    AuthModule,
  ],
})
export class AppModule {}