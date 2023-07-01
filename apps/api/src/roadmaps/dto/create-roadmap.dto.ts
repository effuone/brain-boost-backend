import { ApiProperty } from '@nestjs/swagger';

export class CreateRoadmapDto {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ type: () => [CreateStepDto] })
  steps: CreateStepDto[];
}

export class CreateStepDto {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  stepTitle: string;

  @ApiProperty()
  stepDescription: string;

  @ApiProperty()
  stepStatus: number;

  @ApiProperty({ type: () => [CreateTopicDto] })
  topics: CreateTopicDto[];
}

export class CreateTopicDto {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  topicName: string;

  @ApiProperty()
  topicDescription: string;

  @ApiProperty()
  topicStatus: number;

  @ApiProperty({ type: () => [CreateTopicResourceDto] })
  topicResources: CreateTopicResourceDto[];
}

export class CreateTopicResourceDto {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  resourceName: string;

  @ApiProperty()
  resourceLink: string;
}
