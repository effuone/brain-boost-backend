import { Prisma } from '@prisma/client';
export class RoadmapModel implements Prisma.RoadmapCreateInput {
  id?: number;
  title: string;
  user: Prisma.UserCreateNestedOneWithoutRoadmapsInput;
  description: string;
  steps: Prisma.StepCreateNestedManyWithoutRoadmapInput;
}

export class StepModel implements Prisma.StepCreateInput {
  id?: number;
  stepTitle: string;
  stepDescription: string;
  stepStatus: number;
  roadmap: Prisma.RoadmapCreateNestedOneWithoutStepsInput;
  topics?: Prisma.TopicCreateNestedManyWithoutStepInput;
}

export class TopicModel implements Prisma.TopicCreateInput {
  id?: number;
  topicName: string;
  topicDescription: string;
  topicStatus: number;
  step: Prisma.StepCreateNestedOneWithoutTopicsInput;
  topicResources?: Prisma.TopicResourceCreateNestedManyWithoutTopicInput;
}

export class TopicResourceModel implements Prisma.TopicResourceCreateInput {
  id?: number;
  resourceName: string;
  resourceLink: string;
  topic: Prisma.TopicCreateNestedOneWithoutTopicResourcesInput;
}
