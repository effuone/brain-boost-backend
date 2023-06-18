import { ApiProperty } from '@nestjs/swagger';

export class CreateUserRequest {
    @ApiProperty()
    email:string;
    @ApiProperty()
    username: string;
    @ApiProperty()
    phone: string;
    @ApiProperty()
    password: string;
}

export class CreateUserResponse {
    email:string;
    username: string;
    phone: string;
}