import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MinLength, IsEnum } from 'class-validator';
import { Roles } from 'src/common/enums/roles.enum';

export class SignupDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The full name of the user',
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'The user’s email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Passw0rd!',
    description:
      'Password must be at least 8 characters long and contain a letter, a number, and a special character',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/, {
    message:
      'Password must contain at least one letter, one number, and one special character',
  })
  password: string;

  @ApiProperty({
    enum: Roles,
    example: Roles.USER,
    description: 'User role — either user or provider',
  })
  @IsEnum(Roles, {
    message: `Role must be one of: ${Object.values(Roles).join(', ')}`,
  })
  role: Roles;
}
