import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/persistence/prisma/prisma.service';
import { UpdateRoadmapDto } from './dto/update-roadmap.dto';
import { Roadmap } from '@prisma/client';
import { AiService } from 'src/ai/ai.service';

@Injectable()
export class RoadmapsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
  ) {}

  private readonly logger = new Logger(RoadmapsService.name);

  async createRoadmap(topic: string) {
    this.logger.log(topic);
    const { title, description, steps } =
      await this.aiService.createRoadmapSteps(topic);

    return this.prisma.roadmap.create({
      data: {
        title,
        description,
        steps: {
          create: steps.map((step) => ({
            stepTitle: step.title,
            stepDescription: step.description,
            stepStatus: 1,
            topics: {
              create: step.topics.map((topic) => ({
                topicName: topic.name,
                topicDescription: topic.description,
                topicStatus: 1,
                topicResources: {
                  create: topic.resources.map((resource) => ({
                    resourceName: resource.name,
                    resourceLink: resource.link,
                  })),
                },
              })),
            },
          })),
        },
      },
      include: {
        steps: {
          include: {
            topics: true,
          },
        },
      },
    });
  }

  async getAllRoadmaps(): Promise<Roadmap[]> {
    return this.prisma.roadmap.findMany({
      include: {
        steps: {
          include: {
            topics: true,
          },
        },
      },
    });
  }

  async getRoadmapById(id: number): Promise<Roadmap | null> {
    return this.prisma.roadmap.findUnique({
      where: { id },
      include: {
        steps: true,
      },
    });
  }

  async updateRoadmap(
    id: number,
    updateRoadmapDto: UpdateRoadmapDto,
  ): Promise<Roadmap | null> {
    const { title, description, steps } = updateRoadmapDto;

    return this.prisma.roadmap.update({
      where: { id },
      data: {
        title,
        description,
        steps: {
          updateMany: steps.map((step) => ({
            where: { id: step.id },
            data: {
              stepTitle: step.title,
              stepDescription: step.description,
              stepStatus: step.status,
            },
          })),
        },
      },
    });
  }

  async deleteRoadmap(id: number): Promise<Roadmap | null> {
    return this.prisma.roadmap.delete({
      where: { id },
    });
  }
}
