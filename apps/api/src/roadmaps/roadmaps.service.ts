import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/persistence/prisma/prisma.service';
import { UpdateRoadmapDto } from './dto/update-roadmap.dto';
import { CreateRoadmapDto } from './dto/create-roadmap.dto';
import { Roadmap } from '@prisma/client';

@Injectable()
export class RoadmapsService {
  constructor(private readonly prisma: PrismaService) {}

  async createRoadmap(createRoadmapDto: CreateRoadmapDto): Promise<Roadmap> {
    const { title, description, steps } = createRoadmapDto;

    return this.prisma.roadmap.create({
      data: {
        title,
        description,
        steps: {
          create: steps.map((step) => ({
            stepTitle: step.stepTitle,
            stepDescription: step.stepDescription,
            stepStatus: 1,
            topics: {
              create: step.topics.map((topic) => ({
                topicName: topic.topicName,
                topicDescription: topic.topicDescription,
                topicStatus: 1,
                topicResources: {
                  create: topic.topicResources.map((resource) => ({
                    resourceName: resource.resourceName,
                    resourceLink: resource.resourceLink,
                  })),
                },
              })),
            },
          })),
        },
      },
    });
  }

  async getAllRoadmaps(): Promise<Roadmap[]> {
    return this.prisma.roadmap.findMany();
  }

  async getRoadmapById(id: number): Promise<Roadmap | null> {
    return this.prisma.roadmap.findUnique({
      where: { id },
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
              stepTitle: step.stepTitle,
              stepDescription: step.stepDescription,
              stepStatus: step.stepStatus,
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
