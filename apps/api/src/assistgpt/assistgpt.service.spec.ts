import { Test, TestingModule } from '@nestjs/testing';
import { AssistgptService } from './assistgpt.service';

describe('AssistgptService', () => {
  let service: AssistgptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssistgptService],
    }).compile();

    service = module.get<AssistgptService>(AssistgptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
