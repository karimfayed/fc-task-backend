import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { TimeSlot } from './time-slot.entity';
import { AppointmentStatus } from '../enums/appointment-status';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.appointments, {
    onDelete: 'CASCADE',
    eager: true,
  })
  user: User;

  @OneToOne(() => TimeSlot, (slot) => slot.appointment, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn()
  slot: TimeSlot;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.BOOKED,
  })
  status: AppointmentStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
