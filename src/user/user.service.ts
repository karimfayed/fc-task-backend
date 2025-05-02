import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppointmentDto } from 'src/auth/dtos/appointment.dto';
import { Appointment } from 'src/common/entities/appointment.entity';
import { TimeSlot } from 'src/common/entities/time-slot.entity';
import { User } from 'src/common/entities/user.entity';
import { ErrorMessages } from 'src/common/enums/error-messages.enum';
import { FindOptionsWhere, MoreThan, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(TimeSlot)
    private slotRepo: Repository<TimeSlot>,
  ) {}

  getSlotsAvailable = async (providerId?: string) => {
    const where: FindOptionsWhere<TimeSlot> = {
      isBooked: false,
      startTime: MoreThan(new Date()),
    };

    if (providerId) where.provider = { id: providerId };

    return await this.slotRepo.find({
      where,
      order: { startTime: 'ASC' },
    });
  };

  createAppoitment = async (dto: AppointmentDto, userId: string) => {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(ErrorMessages.USER_NOT_FOUND);

    const slot = await this.slotRepo.findOne({
      where: { id: dto.slotId },
    });

    if (!slot) throw new NotFoundException(ErrorMessages.SLOT_NOT_FOUND);

    if (slot.isBooked) {
      throw new BadRequestException(ErrorMessages.SLOT_ALREADY_BOOKED);
    }

    const appointment = this.appointmentRepo.create({
      user,
      slot,
      status: dto.status || undefined,
    });

    slot.isBooked = true;
    await this.slotRepo.save(slot);

    return await this.appointmentRepo.save(appointment);
  };

  deleteAppoitment = async (appointmentId: string, userId: string) => {
    const appointment = await this.appointmentRepo.findOne({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException(ErrorMessages.APPOINTMENT_NOT_FOUND);
    }

    if (appointment.user.id !== userId) {
      throw new ForbiddenException(ErrorMessages.INVALID_APPOINTMENT_OWNERSHIP);
    }

    if (appointment.slot) {
      appointment.slot.isBooked = false;
      await this.slotRepo.save(appointment.slot);
    }

    await this.appointmentRepo.remove(appointment);
  };
}
