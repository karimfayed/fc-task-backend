import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { RefreshToken } from 'src/auth/entities/refresh-token.entity';
import { Roles } from 'src/common/enums/roles.enum';
import { TimeSlot } from './time-slot.entity';
import { Appointment } from './appointment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash', type: 'text' })
  passwordHash: string;

  @Column({ type: 'enum', enum: Roles })
  role: Roles;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => TimeSlot, (slot) => slot.provider)
  timeSlots: TimeSlot[];

  @OneToMany(() => Appointment, (appointment) => appointment.user)
  appointments: Appointment[];

  @OneToOne(() => RefreshToken, (token) => token.user)
  refreshToken: RefreshToken;
}
