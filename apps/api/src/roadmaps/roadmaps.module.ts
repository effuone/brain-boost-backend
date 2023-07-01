import { Module } from '@nestjs/common';
import { RoadmapsService } from './roadmaps.service';
import { RoadmapsController } from './roadmaps.controller';
import { PrismaService } from 'src/persistence/prisma/prisma.service';

@Module({
  controllers: [RoadmapsController],
  providers: [RoadmapsService, PrismaService],
})
export class RoadmapsModule {}
