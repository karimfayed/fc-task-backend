import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsUUID, IsOptional } from 'class-validator';
import { AppointmentStatus } from 'src/common/enums/appointment-status';

export class AppointmentDto {

  @ApiProperty({
    example: 'b7a8c7a3-5e12-4d7f-8d67-4f9a3e8c89f1',
    description: 'UUID of the slot being booked',
    format: 'uuid',
  })
  @IsUUID()
  slotId: string;

  @ApiPropertyOptional({
    enum: AppointmentStatus,
    example: AppointmentStatus.BOOKED,
    description: 'Status of the appointment (optional, defaults to BOOKED)',
  })
  @IsOptional()
  @IsEnum(AppointmentStatus, {
    message: `Status must be one of: ${Object.values(AppointmentStatus).join(', ')}`,
  })
  status?: AppointmentStatus;
}
