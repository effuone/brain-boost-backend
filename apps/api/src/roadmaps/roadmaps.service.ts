import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/persistence/prisma/prisma.service';
import { UpdateRoadmapDto } from './dto/update-roadmap.dto';
import { Roadmap, Topic } from '@prisma/client';
import { AiService } from 'src/ai/ai.service';

@Injectable()
export class RoadmapsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
  ) {}

  private readonly logger = new Logger(RoadmapsService.name);

  async checkUserRoadmapCompletion(roadmapId: number): Promise<boolean> {
    const topics = await this.prisma.topic.findMany({
      where: { step: { roadmapId } },
      select: { id: true },
    });

    const completedTopics = await this.prisma.topic.count({
      where: { id: { in: topics.map((topic) => topic.id) }, topicStatus: 3 },
    });

    return completedTopics === topics.length;
  }

  async getUserProgress(userId: number): Promise<Topic[]> {
    const topics = await this.prisma.topic.findMany({
      where: {
        step: {
          roadmap: {
            user: { id: userId },
          },
        },
      },
    });

    return topics;
  }

  async updateTopicStatus(
    userId: number,
    topicId: number,
    topicStatus: number,
  ): Promise<void> {
    await this.prisma.topic.update({
      where: { id: topicId },
      data: { topicStatus },
    });
  }

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
        userId: 1, // Assuming you want to associate the roadmap with a specific user (change the userId accordingly)
      },
      include: {
        steps: {
          include: {
            topics: {
              include: {
                topicResources: true,
              },
            },
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
            topics: {
              include: {
                topicResources: true,
              },
            },
          },
        },
      },
    });
  }

  async getRoadmapById(id: number): Promise<Roadmap | null> {
    return this.prisma.roadmap.findUnique({
      where: { id },
      include: {
        steps: {
          include: {
            topics: {
              include: {
                topicResources: true,
              },
            },
          },
        },
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
