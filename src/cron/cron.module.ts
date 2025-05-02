import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from 'src/common/entities/appointment.entity';
import { CronService } from './cron.service';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment])],
  providers: [CronService],
})
export class CronModule {}
