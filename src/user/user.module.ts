import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/common/entities/user.entity';
import { TimeSlot } from 'src/common/entities/time-slot.entity';
import { Appointment } from 'src/common/entities/appointment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, TimeSlot, Appointment])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
