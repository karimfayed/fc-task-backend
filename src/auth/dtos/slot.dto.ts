import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class SlotDto {
  @ApiProperty({
    example: '2025-06-01T10:00:00Z',
    description: 'Start time of the slot in ISO 8601 format (UTC)',
  })
  @IsNotEmpty()
  @IsDateString({}, { message: 'startTime must be a valid ISO date string' })
  startTime: string;

  @ApiProperty({
    example: '2025-06-01T10:30:00Z',
    description: 'End time of the slot in ISO 8601 format (UTC)',
  })
  @IsNotEmpty()
  @IsDateString({}, { message: 'endTime must be a valid ISO date string' })
  endTime: string;
}
