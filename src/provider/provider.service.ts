import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SlotDto } from 'src/auth/dtos/slot.dto';
import { TimeSlot } from 'src/common/entities/time-slot.entity';
import { User } from 'src/common/entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class ProviderService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(TimeSlot)
    private slotRepo: Repository<TimeSlot>,
  ) {}

  getSlots = async (showOnlyBooked: boolean, userId: string) => {
    const where: FindOptionsWhere<TimeSlot> = {
      provider: { id: userId },
    };
    if (showOnlyBooked) where.isBooked = true;

    return await this.slotRepo.find({
      where,
      order: { startTime: 'ASC' },
    });
  };

  createSlot = async (dto: SlotDto, providerId: string) => {
    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);

    if (start >= end) {
      throw new BadRequestException('End time must be after start time');
    }

    const provider = await this.userRepo.findOne({
      where: { id: providerId },
    });

    if (!provider) {
      throw new BadRequestException('Provider not found');
    }

    const slot = this.slotRepo.create({
      startTime: start,
      endTime: end,
      provider,
    });

    return await this.slotRepo.save(slot);
  };

  updateSlot = async (slotId: string, providerId: string, dto: SlotDto) => {
    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);

    if (start >= end) {
      throw new BadRequestException('End time must be after start time');
    }

    const slot = await this.slotRepo.findOne({
      where: { id: slotId },
    });

    if (!slot) {
      throw new NotFoundException('Slot not found');
    }
    console.log('slot.provider', slot.provider);
    console.log('providerId', providerId);

    if (slot.provider.id !== providerId) {
      throw new ForbiddenException('You can only update your own slots');
    }

    slot.startTime = start;
    slot.endTime = end;

    return await this.slotRepo.save(slot);
  };

  async deleteSlotById(slotId: string, providerId: string) {
    const slot = await this.slotRepo.findOne({
      where: {
        id: slotId,
        provider: { id: providerId },
      },
    });

    if (!slot) {
      throw new NotFoundException('Slot not found or access denied');
    }

    await this.slotRepo.remove(slot);
  }
}
