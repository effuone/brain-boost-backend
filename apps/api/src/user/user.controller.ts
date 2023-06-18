import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiBody, ApiProperty } from '@nestjs/swagger';
import { User as UserModel} from '@prisma/client';
import { CreateUserRequest, CreateUserResponse } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('Users')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Post('signup')
    @ApiBody({ type: () => CreateUserRequest })
    async signupUser(@Body() userData: CreateUserRequest): Promise<CreateUserResponse> {
      return this.userService.createUser(userData);
    }
}
