import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './entities/refresh-token.entity';
import { v4 as uuidv4 } from 'uuid';
import { ErrorMessages } from 'src/common/enums/error-messages.enum';
import { Roles } from 'src/common/enums/roles.enum';
import { User } from 'src/common/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(RefreshToken)
    private refreshTokenRepo: Repository<RefreshToken>,
    private readonly jwtService: JwtService
  ) {}

  async signup(signupData: SignupDto) {
    const isEmailExists = await this.userRepo.findOne({
      where: { email: signupData.email },
    });

    if (isEmailExists)
      throw new BadRequestException(ErrorMessages.EMAIL_EXISTS);

    const hashedPassword = await bcrypt.hash(signupData.password, 10);

    const user = this.userRepo.create({
      name: signupData.name,
      email: signupData.email,
      passwordHash: hashedPassword,
      role: signupData.role,
    });

    const savedUser = await this.userRepo.save(user);

    return { user: savedUser };
  }

  async login(creds: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: creds.email },
    });

    if (!user) throw new UnauthorizedException(ErrorMessages.INVALID_CREDS);

    const isPasswordValid = await bcrypt.compare(
      creds.password,
      user.passwordHash,
    );

    if (!isPasswordValid)
      throw new UnauthorizedException(ErrorMessages.INVALID_CREDS);

    return this.generateUserTokens(user.id, user.role);
  }

  async refreshToken(refreshToken: string) {
    const tokenEntity = await this.refreshTokenRepo.findOne({
      where: {
        token: refreshToken,
        expiryDate: MoreThanOrEqual(new Date()),
      },
    });

    console.log('Token ENtity', tokenEntity);

    if (!tokenEntity) {
      throw new UnauthorizedException(ErrorMessages.INVALID_REFRESH_TOKEN);
    }

    // Delete the used refresh token
    await this.refreshTokenRepo.remove(tokenEntity);

    return this.generateUserTokens(tokenEntity.user.id, tokenEntity.role);
  }

  async generateUserTokens(userId: string, role: Roles) {
    const accessToken = await this.jwtService.sign(
      { userId, role },
    );

    const refreshToken = uuidv4();
    await this.storeRefreshToken(refreshToken, userId, role);

    return {
      accessToken,
      refreshToken,
    };
    // return this.jwtService.sign({ userId: 'abc', role: 'user' }, { secret: '123', expiresIn: '1m' });
  }

  async storeRefreshToken(token: string, userId: string, role: Roles) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);

    const user = await this.userRepo.findOneOrFail({ where: { id: userId } });

    const existingToken = await this.refreshTokenRepo.findOne({
      where: { user: { id: userId } },
    });

    if (existingToken) {
      existingToken.token = token;
      existingToken.expiryDate = expiryDate;
      await this.refreshTokenRepo.save(existingToken);
    } else {
      const refreshToken = this.refreshTokenRepo.create({
        token,
        expiryDate,
        user,
        role,
      });

      await this.refreshTokenRepo.save(refreshToken);
    }
  }
}
