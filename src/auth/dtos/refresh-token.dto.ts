import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    example: '8be0a1f4-1234-45b6-8e11-9a5cfa1ab1c8',
    description: 'Refresh token string issued during login',
  })
  @IsString()
  refreshToken: string;
}
