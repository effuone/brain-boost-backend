import { Module } from '@nestjs/common';
import { AssistgptService } from './assistgpt.service';
import { AssistgptController } from './assistgpt.controller';

@Module({
  controllers: [AssistgptController],
  providers: [AssistgptService]
})
export class AssistgptModule {}
