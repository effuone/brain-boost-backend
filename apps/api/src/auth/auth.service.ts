import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import * as crypto from 'crypto';
import {
  CreateUserRequestDto,
  CreateUserResponseDto,
  LoginUserRequestDto,
  LoginUserResponseDto,
  UserDto,
} from '../user/user.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  private readonly logger = new Logger(AuthService.name);

  hashPassword = (password: string): string => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
      .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
      .toString('hex');

    const hashedPassword = `pbkdf2_sha512$10000$${salt}$${hash}`;
    return hashedPassword;
  };

  verifyPassword = (password: string, hashedPassword: string): boolean => {
    const parts = hashedPassword.split('$');
    if (parts.length !== 4) {
      return false;
    }

    const [, iterationCount, salt, hash] = parts;
    const generatedHash = crypto
      .pbkdf2Sync(password, salt, parseInt(iterationCount, 10), 64, 'sha512')
      .toString('hex');

    return hash === generatedHash;
  };

  async checkIfUserExists(email: string): Promise<boolean> {
    const user = await this.userService.getUserByEmail(email);
    return user ? true : false;
  }

  async signUp(
    data: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> | null {
    const registerUserModel: Prisma.UserCreateInput = {
      username: data.username,
      email: data.email,
      phone: data.phone || '',
      password_hash: this.hashPassword(data.password),
    };
    this.logger.log(`New user: ${data.username}/${data.email}`);
    const newUserModel = await this.userService.createUser(registerUserModel);
    return {
      email: newUserModel.email,
      username: newUserModel.username,
      phone: newUserModel.phone,
    };
  }

  async signIn(data: LoginUserRequestDto): Promise<LoginUserResponseDto> {
    const user = await this.userService.getUserByEmail(data.email);
    this.verifyPassword(data.password, user.password_hash);
    const userDto = {
      sub: user.id,
      email: user.email,
      username: user.username,
      phone: user.phone,
    };
    const payload: LoginUserResponseDto = {
      accessToken: this.jwtService.sign(userDto, {
        privateKey: process.env.JWT_KEY,
      }),
    };
    return payload;
  }

  async getUserData(token: string): Promise<UserDto> {
    const decodedData: any = this.jwtService.decode(token);
    const userData: UserDto = {
      id: decodedData.sub,
      email: decodedData.email ? decodedData.email : '',
      username: decodedData.username ? decodedData.username : '',
      phone: decodedData.phone ? decodedData.phone : '',
    };
    return userData;
  }
}
