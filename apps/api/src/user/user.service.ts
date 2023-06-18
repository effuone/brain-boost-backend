import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/persistence/prisma/prisma.service';
import { CreateUserRequestDto, CreateUserResponseDto, LoginUserRequestDto, LoginUserResponseDto } from './user.dto';
import * as crypto from 'crypto'
import { User, Prisma } from '@prisma/client';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async getUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async updateUser(id: number, data: Prisma.UserUpdateInput): Promise<User | null> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async deleteUser(id: number): Promise<User | null> {
    return this.prisma.user.delete({ where: { id } });
  }
}