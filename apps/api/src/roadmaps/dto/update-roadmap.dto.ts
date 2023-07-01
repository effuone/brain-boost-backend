import { PartialType } from '@nestjs/swagger';
import {
  CreateRoadmapDto,
  CreateStepDto,
  CreateTopicDto,
  CreateTopicResourceDto,
} from './create-roadmap.dto';

export class UpdateRoadmapDto extends PartialType(CreateRoadmapDto) {}
export class UpdateStepDto extends PartialType(CreateStepDto) {}
export class UpdateTopicDto extends PartialType(CreateTopicDto) {}
export class UpdateTopicResourceDto extends PartialType(
  CreateTopicResourceDto,
) {}
