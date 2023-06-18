import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as crypto from 'crypto';
import { CreateUserRequestDto, CreateUserResponseDto, LoginUserRequestDto, LoginUserResponseDto, mapUserToCreateUserResponseDto } from 'src/user/user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}
  private readonly logger = new Logger(AuthService.name);

  private hashPassword = (password: string) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
      .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
      .toString('hex');

    const hashedPassword = `pbkdf2_sha512$10000$${salt}$${hash}`;
    return hashedPassword;
  };

  private validatePassword(password: string, hashedPassword: string): boolean {
    const [iterations, salt, hash] = hashedPassword.split('$');
    const derivedKey = crypto
      .pbkdf2Sync(password, salt, Number(iterations), 64, 'sha512')
      .toString('hex');
    const isValid = derivedKey === hash;
    return isValid;
  }

  async checkIfUserExists(email: string) {
    const user = await this.userService.getUserByEmail(email)
    return user ? user : null
  }

  async signUp(data: CreateUserRequestDto): Promise<CreateUserResponseDto> | null {
    const registerUserModel: Prisma.UserCreateInput = {
      username: data.username,
      email: data.email,
      phone: data.phone || '',
      password_hash: this.hashPassword(data.password),
    };
    this.logger.log(`New user: ${data.username}/${data.email}`)
    const newUserModel = await this.userService.createUser(registerUserModel);
    return mapUserToCreateUserResponseDto(newUserModel)
  }

//   async signIn(data: LoginUserRequestDto): Promise<LoginUserResponseDto> | null {
    
//   }
}
