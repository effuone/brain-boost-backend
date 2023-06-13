import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validationSchemaForEnv } from './config/environment-variables';
import { PersistenceModule } from './persistence/persistence.module';
import { UserService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { PostModule } from './post/post.module';
import { PostService } from './post/post.service';
import { PostController } from './post/post.controller';
import { PrismaService } from './persistence/prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: validationSchemaForEnv,
    }),
    PersistenceModule,
    UsersModule,
    PostModule
  ],
  controllers: [AppController, PostController],
  providers: [AppService, UserService, PostService, PrismaService],
})
export class AppModule {}
