import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/persistence/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { CreateUserRequest, CreateUserResponse } from './user.dto';
import * as crypto from 'crypto'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  hashPassword = (password: string) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
      .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
      .toString('hex');
  
    const hashedPassword = `pbkdf2_sha512$10000$${salt}$${hash}`;
    return hashedPassword;
  }
  

  async createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
    const existingUser = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser === null) {
      const hashedPassword = this.hashPassword(data.password);
      delete data.password;
      return await this.prisma.user.create({
        data: {
          ...data,
          password_hash: hashedPassword,
        },
        select: {
          username: true,
          email: true,
          phone: true
        }
      });
    }
  }  

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
}