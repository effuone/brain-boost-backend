import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validationSchemaForEnv } from './config/environment-variables';
import { PersistenceModule } from './persistence/persistence.module';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { PostService } from './post/post.service';
import { PostController } from './post/post.controller';
import { PrismaService } from './persistence/prisma/prisma.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: validationSchemaForEnv,
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    JwtModule,
    AuthModule,
    PersistenceModule,
    UserModule,
    PostModule
  ],
  controllers: [AppController, PostController, AuthController],
  providers: [PostService],
})
export class AppModule {}
