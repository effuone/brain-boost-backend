import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { UserService } from 'src/users/users.service';
import { PrismaService } from 'src/persistence/prisma/prisma.service';

@Module({
  controllers: [PostController],
  providers: [PostService, PrismaService]
})
export class PostModule {}
