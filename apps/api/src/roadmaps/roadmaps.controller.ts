import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RoadmapsService } from './roadmaps.service';
import { UpdateRoadmapDto } from './dto/update-roadmap.dto';
import {
  GenerateRoadmapDto,
  CreateRoadmapTestsDto,
} from './dto/create-roadmap.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AiService } from 'src/ai/ai.service';

@Controller('roadmaps')
@ApiTags('Roadmaps')
@ApiBearerAuth()
export class RoadmapsController {
  constructor(
    private readonly roadmapsService: RoadmapsService,
    private readonly aiService: AiService,
  ) {}

  @Post()
  @ApiBody({ type: GenerateRoadmapDto })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @UseGuards(AuthGuard)
  createRoadmap(@Body() data: GenerateRoadmapDto) {
    return this.roadmapsService.createRoadmap(data.title);
  }

  @Post('tests')
  @ApiBody({ type: CreateRoadmapTestsDto })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @UseGuards(AuthGuard)
  createRoadmapTest(@Body() data: CreateRoadmapTestsDto) {
    return this.aiService.createRoadmapTests(data.topic);
  }

  @Get()
  @UseGuards(AuthGuard)
  getAllRoadmaps() {
    return this.roadmapsService.getAllRoadmaps();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  getRoadmapById(@Param('id') id: string) {
    return this.roadmapsService.getRoadmapById(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiResponse({ status: 204, description: 'Successful operation' })
  updateRoadmapById(
    @Param('id') id: string,
    @Body() updateRoadmapDto: UpdateRoadmapDto,
  ) {
    return this.roadmapsService.updateRoadmap(+id, updateRoadmapDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteRoadmapById(@Param('id') id: string) {
    return this.roadmapsService.deleteRoadmap(+id);
  }
}
