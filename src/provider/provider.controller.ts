import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProviderService } from './provider.service';
import { SlotDto } from 'src/auth/dtos/slot.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RequestDto } from 'src/auth/dtos/request.dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { RolesAllowed } from 'src/common/decorators/roles.decorator';
import { Roles } from 'src/common/enums/roles.enum';

@UseGuards(AuthGuard, RolesGuard)
@Controller('provider')
@RolesAllowed(Roles.PROVIDER)
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Get('slot')
  async getSlots(
    @Req() req: RequestDto,
    @Query('isBookedOnly') isBookedOnly?: string,
  ) {
    const showOnlyBooked = isBookedOnly === 'true';
    const providerId = req.userId;
    return await this.providerService.getSlots(showOnlyBooked, providerId);
  }

  @Post('slot')
  async createSlot(@Body() slotData: SlotDto, @Req() req: RequestDto) {
    const providerId = req.userId;
    return await this.providerService.createSlot(slotData, providerId);
  }

  @Put('slot/:slotId')
  async updateSlot(
    @Param('slotId') slotId: string,
    @Req() req: RequestDto,
    @Body() slotData: SlotDto,
  ) {
    const providerId = req.userId;

    return await this.providerService.updateSlot(slotId, providerId, slotData);
  }

  @Delete('slot/:slotId')
  async deleteSlot(@Param('slotId') slotId: string, @Req() req: RequestDto) {
    const providerId = req.userId;
    await this.providerService.deleteSlotById(slotId, providerId);
  }
}
