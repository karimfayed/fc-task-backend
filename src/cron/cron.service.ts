import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThan } from 'typeorm';
import { Appointment, AppointmentStatus } from 'src/common/entities/appointment.entity';
import { addMinutes, isBefore } from 'date-fns';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
  ) {}

  // ✅ Runs every minute
  @Cron(CronExpression.EVERY_MINUTE)
  async sendReminderEmailsAndUpdateAppointments() {
    const now = new Date();
    const reminderThreshold = addMinutes(now, 30);

    // ✅ Send reminders for appointments starting in ~30 min
    const upcomingAppointments = await this.appointmentRepo.find({
      where: {
        status: AppointmentStatus.BOOKED,
        slot: {
          startTime: LessThanOrEqual(reminderThreshold),
        },
      },
    });

    console.log("INSIDE CRON");
    

    for (const appointment of upcomingAppointments) {
      // send your reminder email here (mock/log/send)
      this.logger.log(
        `Sending reminder to ${appointment.user.email} for appointment at ${appointment.slot.startTime}`,
      );
      // TODO: integrate actual email service
    }

    // ✅ Mark past appointments as completed (optional)
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
