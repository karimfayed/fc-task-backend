import { IsEmail, IsString, Matches, MinLength, IsEnum } from 'class-validator';
import { Roles } from 'src/common/enums/roles.enum';

export class SignupDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/, {
    message:
      'Password must contain at least one letter, one number, and one special character',
  })
  password: string;

  @IsEnum(Roles, {
    message: `Role must be one of: ${Object.values(Roles).join(', ')}`,
  })
  role: Roles;
}
