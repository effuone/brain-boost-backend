import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AssistgptService } from './assistgpt.service';
import { CreateAssistgptDto } from './dto/create-assistgpt.dto';
import { UpdateAssistgptDto } from './dto/update-assistgpt.dto';

@Controller('assistgpt')
export class AssistgptController {
  constructor(private readonly assistgptService: AssistgptService) {}

  @Post()
  createRoadmap(@Body() createAssistgptDto: CreateAssistgptDto) {
    return this.assistgptService.createRoadmap(createAssistgptDto);
  }

}
