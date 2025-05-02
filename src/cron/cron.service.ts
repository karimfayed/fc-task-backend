import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThan } from 'typeorm';
import { Appointment } from 'src/common/entities/appointment.entity';
import { addMinutes, isBefore } from 'date-fns';
import { AppointmentStatus } from 'src/common/enums/appointment-status';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async sendReminderEmailsAndUpdateAppointments() {
    const now = new Date();
    const reminderThreshold = addMinutes(now, 30);

    const upcomingAppointments = await this.appointmentRepo.find({
      where: {
        status: AppointmentStatus.BOOKED,
        slot: {
          startTime: LessThanOrEqual(reminderThreshold),
        },
      },
    });

    for (const appointment of upcomingAppointments) {
      this.logger.log(
        `Sending reminder to ${appointment.user.email} for appointment at ${appointment.slot.startTime}`,
      );
    }

    const pastAppointments = await this.appointmentRepo.find({
      where: {
        status: AppointmentStatus.BOOKED,
        slot: {
          startTime: LessThanOrEqual(now),
        },
      },
    });

    for (const appointment of pastAppointments) {
      appointment.status = AppointmentStatus.COMPLETED;
      await this.appointmentRepo.save(appointment);
      this.logger.log(`Marked appointment ${appointment.id} as COMPLETED.`);
    }
  }
}
