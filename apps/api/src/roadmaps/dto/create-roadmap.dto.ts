import { ApiProperty } from '@nestjs/swagger';

export class GenerateRoadmapDto {
  @ApiProperty()
  title: string;
}

export class CreateRoadmapDto {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description?: string;

  @ApiProperty({ type: () => [CreateStepDto] })
  steps?: CreateStepDto[];
}

export class CreateStepDto {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  status?: number;

  @ApiProperty({ type: () => [CreateTopicDto] })
  topics: CreateTopicDto[];
}

export class CreateTopicDto {
  @ApiProperty()
  id?: number;
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  status?: number;

  @ApiProperty({ type: () => [CreateTopicResourceDto] })
  resources: CreateTopicResourceDto[];
}

export class CreateTopicResourceDto {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  link: string;
}

export class CreateRoadmapTestsDto {
  @ApiProperty()
  topic: string;
}
