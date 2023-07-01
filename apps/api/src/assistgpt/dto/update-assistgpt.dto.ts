import { PartialType } from '@nestjs/swagger';
import { CreateAssistgptDto } from './create-assistgpt.dto';

export class UpdateAssistgptDto extends PartialType(CreateAssistgptDto) {}
