import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoadmapsService } from './roadmaps.service';
import { CreateRoadmapDto } from './dto/create-roadmap.dto';
import { UpdateRoadmapDto } from './dto/update-roadmap.dto';

@Controller('roadmaps')
export class RoadmapsController {
  constructor(private readonly roadmapsService: RoadmapsService) {}

  @Post()
  createRoadmap(@Body() createRoadmapDto: CreateRoadmapDto) {
    return this.roadmapsService.createRoadmap(createRoadmapDto);
  }

  @Get()
  getAllRoadmaps() {
    return this.roadmapsService.getAllRoadmaps();
  }

  @Get(':id')
  getRoadmapById(@Param('id') id: string) {
    return this.roadmapsService.getRoadmapById(+id);
  }

  @Patch(':id')
  updateRoadmapById(
    @Param('id') id: string,
    @Body() updateRoadmapDto: UpdateRoadmapDto,
  ) {
    return this.roadmapsService.updateRoadmap(+id, updateRoadmapDto);
  }

  @Delete(':id')
  deleteRoadmapById(@Param('id') id: string) {
    return this.roadmapsService.deleteRoadmap(+id);
  }
}
