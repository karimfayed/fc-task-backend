import { IsEnum, IsUUID, IsOptional } from 'class-validator';
import { AppointmentStatus } from 'src/common/enums/appointment-status';

export class AppointmentDto {
  @IsUUID()
  slotId: string;

  @IsOptional()
  @IsEnum(AppointmentStatus, {
    message: `Status must be one of: ${Object.values(AppointmentStatus).join(', ')}`,
  })
  status?: AppointmentStatus;
}
