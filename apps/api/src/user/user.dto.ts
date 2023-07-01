import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  MinLength,
  MaxLength,
  Matches,
  IsPhoneNumber,
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateUserRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty()
  @MinLength(8)
  @MaxLength(20)
  @IsNotEmpty()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;
}

export class CreateUserResponseDto extends OmitType(CreateUserRequestDto, [
  'password',
]) {}
export class LoginUserRequestDto {
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  password: string;
}

export class LoginUserResponseDto {
  accessToken: string;
}

export class UserDto {
  id: number;
  email: string;
  username: string;
  phone: string;
}
