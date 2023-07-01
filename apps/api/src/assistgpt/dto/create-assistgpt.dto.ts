import { ApiProperty } from '@nestjs/swagger';

export class CreateAssistgptDto {
    @ApiProperty()
    roadmapTopic: string;
}
