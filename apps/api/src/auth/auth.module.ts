import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/persistence/prisma/prisma.service';
//ты пытался импортировать пасспорт модуль из 
// https://www.prisma.io/blog/nestjs-prisma-authentication-7D056s1s0k3l

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserService, PrismaService]
})
export class AuthModule {}
