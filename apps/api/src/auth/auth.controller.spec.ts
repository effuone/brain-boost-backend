import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  CreateUserRequestDto,
  CreateUserResponseDto,
  LoginUserRequestDto,
} from '../user/user.dto';
import { HttpStatus, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { PrismaService } from '../persistence/prisma/prisma.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, JwtService, UserService, PrismaService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('signUpUser', () => {
    it('should sign up a new user and return the user DTO', async () => {
      const userData: CreateUserRequestDto = {
        email: 'test@example.com',
        username: 'testuser',
        phone: '+123456789',
        password: 'testpassword',
      };
      const newUser: CreateUserResponseDto = {
        email: userData.email,
        username: userData.username,
        phone: userData.phone,
      };

      jest.spyOn(authService, 'checkIfUserExists').mockResolvedValue(false);
      jest.spyOn(authService, 'signUp').mockResolvedValue(newUser);

      const result = await controller.signUpUser(userData);

      expect(authService.checkIfUserExists).toHaveBeenCalledWith(
        userData.email,
      );
      expect(authService.signUp).toHaveBeenCalledWith(userData);
      expect(result).toEqual(newUser);
    });

    it('should throw an error if the user already exists', async () => {
      const userData: CreateUserRequestDto = {
        email: 'test@example.com',
        username: 'testuser',
        phone: '+123456789',
        password: 'testpassword',
      };

      jest.spyOn(authService, 'checkIfUserExists').mockResolvedValue(true);

      await expect(controller.signUpUser(userData)).rejects.toThrowError(
        new HttpException('User already exists', HttpStatus.BAD_REQUEST),
      );

      expect(authService.checkIfUserExists).toHaveBeenCalledWith(
        userData.email,
      );
    });

    it('should throw any error thrown by the service', async () => {
      const userData: CreateUserRequestDto = {
        email: 'test@example.com',
        username: 'testuser',
        phone: '+123456789',
        password: 'testpassword',
      };
      const error = new Error('Some error');

      jest.spyOn(authService, 'checkIfUserExists').mockRejectedValue(error);

      await expect(controller.signUpUser(userData)).rejects.toThrowError(error);

      expect(authService.checkIfUserExists).toHaveBeenCalledWith(
        userData.email,
      );
    });
  });

  describe('signInUser', () => {
    it('should sign in an existing user and return the access token', async () => {
      const userData: LoginUserRequestDto = {
        email: 'test@example.com',
        password: 'testpassword',
      };
      const accessToken = { accessToken: 'access_token' };

      jest.spyOn(authService, 'checkIfUserExists').mockResolvedValue(true);
      jest.spyOn(authService, 'signIn').mockResolvedValue(accessToken);

      const result = await controller.signInUser(userData);

      expect(authService.checkIfUserExists).toHaveBeenCalledWith(
        userData.email,
      );
      expect(authService.signIn).toHaveBeenCalledWith(userData);
      expect(result).toEqual(accessToken);
    });

    it('should throw an error if the user does not exist', async () => {
      const userData: LoginUserRequestDto = {
        email: 'test@example.com',
        password: 'testpassword',
      };

      jest.spyOn(authService, 'checkIfUserExists').mockResolvedValue(false);

      await expect(controller.signInUser(userData)).rejects.toThrowError(
        new HttpException('This user is not found', HttpStatus.NOT_FOUND),
      );

      expect(authService.checkIfUserExists).toHaveBeenCalledWith(
        userData.email,
      );
    });

    it('should throw any error thrown by the service', async () => {
      const userData: LoginUserRequestDto = {
        email: 'test@example.com',
        password: 'testpassword',
      };
      const error = new Error('Some error');

      jest.spyOn(authService, 'checkIfUserExists').mockRejectedValue(error);

      await expect(controller.signInUser(userData)).rejects.toThrowError(error);

      expect(authService.checkIfUserExists).toHaveBeenCalledWith(
        userData.email,
      );
    });
  });
});
