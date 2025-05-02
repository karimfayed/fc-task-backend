import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Appointment } from './appointment.entity';

@Entity('time_slots')
@Unique(['provider', 'startTime', 'endTime']) // prevent overlapping slots
export class TimeSlot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.timeSlots, {
    onDelete: 'CASCADE',
    eager: true,
  })
  provider: User;

  @Column({ name: 'start_time', type: 'timestamp' })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamp' })
  endTime: Date;

  @Column({ name: 'is_booked', default: false })
  isBooked: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToOne(() => Appointment, (appointment) => appointment.slot)
  appointment: Appointment;
}
