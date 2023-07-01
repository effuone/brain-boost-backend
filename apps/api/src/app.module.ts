import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { validationSchemaForEnv } from './config/environment-variables';
import { PersistenceModule } from './persistence/persistence.module';
import { UserModule } from './user/user.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { RoadmapsModule } from './roadmaps/roadmaps.module';
import { AiModule } from './ai/ai.module';

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
    RoadmapsModule,
    AiModule,
  ],
  controllers: [AppController, AuthController],
  providers: [],
})
export class AppModule {}
