import { Module } from '@nestjs/common';
import { RoadmapsService } from './roadmaps.service';
import { RoadmapsController } from './roadmaps.controller';
import { PrismaService } from 'src/persistence/prisma/prisma.service';
import { AiService } from 'src/ai/ai.service';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [RoadmapsController],
  providers: [
    RoadmapsService,
    PrismaService,
    AiService,
    AuthService,
    UserService,
  ],
})
export class RoadmapsModule {}
