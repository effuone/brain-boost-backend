import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Headers,
  Logger,
  Get,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import {
  CreateUserRequestDto,
  LoginUserRequestDto,
  UserDto,
} from '../user/user.dto';
import { AuthService } from './auth.service';
import { LoginUserResponseDto } from '../user/user.dto';
import { AuthGuard } from './auth.guard';
@Controller('auth')
@ApiBearerAuth()
@ApiTags('Authentication & Authorization')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  private readonly logger = new Logger(AuthController.name);

  @Post('signup')
  @HttpCode(200)
  @ApiBody({
    type: () => CreateUserRequestDto,
    description: 'User signup data',
    required: true,
    schema: {
      example: {
        email: 'example@example.com',
        username: 'example',
        phone: '+123456789',
        password: 'V3ry_strong_P@ssword',
      },
    },
  })
  async signUpUser(
    @Body() userData: CreateUserRequestDto,
  ): Promise<LoginUserResponseDto> {
    try {
      const userExists = await this.authService.checkIfUserExists(
        userData.email,
      );
      if (userExists) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }

      const newUser = await this.authService.signUp(userData);
      this.logger.log(`User signed up: ${newUser.email}`);
      const accessToken = await this.authService.signIn(userData);
      return accessToken;
    } catch (error: any) {
      this.logger.error(`Error signing up user: ${error.message}`);
      console.log(error);
      throw error;
    }
  }

  @Post('signin')
  @HttpCode(200)
  @ApiBody({
    type: () => LoginUserRequestDto,
    description: 'User signin data',
    required: true,
    schema: {
      example: {
        email: 'example@example.com',
        password: 'V3ry_strong_P@ssword',
      },
    },
  })
  async signInUser(
    @Body() userData: LoginUserRequestDto,
  ): Promise<LoginUserResponseDto> {
    try {
      const userExists = await this.authService.checkIfUserExists(
        userData.email,
      );
      if (!userExists) {
        throw new HttpException('This user is not found', HttpStatus.NOT_FOUND);
      }

      const accessToken = await this.authService.signIn(userData);
      this.logger.log(`User logged in: ${userData.email}`);
      return accessToken;
    } catch (error: any) {
      this.logger.error(`Error logging up user: ${error.message}`);
      console.log(error);
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Get('profile')
  async getProfile(@Headers() headers): Promise<UserDto> {
    try {
      const token = headers['authorization'].split(' ')[1];
      return await this.authService.getUserData(token);
    } catch (error: any) {
      this.logger.error(`Error checking up profile: ${error.message}`);
      console.log(error);
      throw error;
    }
  }
}
