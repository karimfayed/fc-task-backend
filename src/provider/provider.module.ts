import { Module } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { ProviderController } from './provider.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/common/entities/user.entity';
import { TimeSlot } from 'src/common/entities/time-slot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, TimeSlot])],
  controllers: [ProviderController],
  providers: [ProviderService],
})
export class ProviderModule {}
