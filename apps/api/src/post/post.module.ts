import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PrismaService } from '../persistence/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [JwtModule, AuthModule],
  controllers: [PostController],
  providers: [PostService, PrismaService],
})
export class PostModule {}
