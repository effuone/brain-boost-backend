import { Test, TestingModule } from '@nestjs/testing';
import { AssistgptController } from './assistgpt.controller';
import { AssistgptService } from './assistgpt.service';

describe('AssistgptController', () => {
  let controller: AssistgptController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssistgptController],
      providers: [AssistgptService],
    }).compile();

    controller = module.get<AssistgptController>(AssistgptController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
