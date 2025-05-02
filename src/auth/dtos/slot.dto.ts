import { IsDateString, IsNotEmpty } from 'class-validator';

export class SlotDto {
  @IsNotEmpty()
  @IsDateString({}, { message: 'startTime must be a valid ISO date string' })
  startTime: string;

  @IsNotEmpty()
  @IsDateString({}, { message: 'endTime must be a valid ISO date string' })
  endTime: string;
}
