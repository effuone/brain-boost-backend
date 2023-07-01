import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import {
  CreateUserRequestDto,
  CreateUserResponseDto,
  LoginUserRequestDto,
  LoginUserResponseDto,
} from '../user/user.dto';
import { PrismaService } from '../persistence/prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UserService, JwtService, PrismaService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('checkIfUserExists', () => {
    it('should return user if user exists', async () => {
      const email = 'johndoe@example.com';
      const user: User | null = {
        id: 1,
        username: 'johndoe',
        email: email,
        phone: '',
        password_hash: 'hashedPassword',
        emailConfirmed: false,
      };

      jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(user);

      const userExists = await service.checkIfUserExists(email);

      expect(userService.getUserByEmail).toHaveBeenCalledWith(email);
      expect(userExists).toEqual(true);
    });

    it('should return null if user does not exist', async () => {
      const email = 'johndoe@example.com';

      jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(null);

      const existingUser = await service.checkIfUserExists(email);

      expect(userService.getUserByEmail).toHaveBeenCalledWith(email);
      expect(existingUser).toEqual(false);
    });
  });

  describe('signUp', () => {
    it('should create a new user and return the user DTO', async () => {
      const data: CreateUserRequestDto = {
        username: 'johndoe',
        email: 'johndoe@example.com',
        phone: '',
        password: 'password',
      };
      const newUserModel: User = {
        id: 1,
        username: 'johndoe',
        email: 'johndoe@example.com',
        phone: '',
        password_hash: 'hashedPassword',
        emailConfirmed: false,
      };
      const createUserResponseDto: CreateUserResponseDto = {
        username: newUserModel.username,
        email: newUserModel.email,
        phone: newUserModel.phone,
      };

      jest.spyOn(service, 'hashPassword').mockReturnValue('hashedPassword');
      jest.spyOn(userService, 'createUser').mockResolvedValue(newUserModel);

      const createdUser = await service.signUp(data);

      expect(service.hashPassword).toHaveBeenCalledWith(data.password);
      expect(userService.createUser).toHaveBeenCalledWith({
        username: data.username,
        email: data.email,
        phone: data.phone,
        password_hash: 'hashedPassword',
      });
      expect(createdUser).toEqual(createUserResponseDto);
    });
  });

  describe('signIn', () => {
    it('should sign in the user and return the access token', async () => {
      const data: LoginUserRequestDto = {
        email: 'johndoe@example.com',
        password: 'password',
      };
      const user: User | null = {
        id: 1,
        username: 'johndoe',
        email: data.email,
        phone: '',
        password_hash: 'hashedPassword',
        emailConfirmed: false,
      };
      const loginUserResponseDto: LoginUserResponseDto = {
        accessToken: 'accessToken',
      };

      jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(user);
      jest.spyOn(service, 'verifyPassword').mockReturnValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue('accessToken');

      const signInResult = await service.signIn(data);

      expect(userService.getUserByEmail).toHaveBeenCalledWith(data.email);
      expect(service.verifyPassword).toHaveBeenCalledWith(
        data.password,
        user.password_hash,
      );
      expect(jwtService.sign).toHaveBeenCalledWith(
        {
          sub: user.id,
          email: user.email,
          username: user.username,
          phone: user.phone,
        },
        { privateKey: process.env.JWT_KEY },
      );
      expect(signInResult).toEqual(loginUserResponseDto);
    });
  });
});
