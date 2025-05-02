import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AppointmentDto } from 'src/auth/dtos/appointment.dto';
import { RequestDto } from 'src/auth/dtos/request.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesAllowed } from 'src/common/decorators/roles.decorator';
import { Roles } from 'src/common/enums/roles.enum';
import { RolesGuard } from 'src/guards/roles.guard';

@UseGuards(AuthGuard, RolesGuard)
@Controller('user')
@RolesAllowed(Roles.USER)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('slot/available')
  async getSlots(@Query('providerId') providerId?: string) {
    return await this.userService.getSlotsAvailable(providerId);
  }

  @Post('appointment')
  createAppoitment(
    @Body() appointmentDto: AppointmentDto,
    @Req() req: RequestDto,
  ) {
    const userId = req.userId;
    return this.userService.createAppoitment(appointmentDto, userId);
  }

  @Delete('appointment/:appoitmentId')
  deleteAppoitment(
    @Param('slotId') appoitmentId: string,
    @Req() req: RequestDto,
  ) {
    const userId = req.userId;
    return this.userService.deleteAppoitment(appoitmentId, userId);
  }
}
