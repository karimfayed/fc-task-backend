import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Roles } from 'src/common/enums/roles.enum';
import { User } from 'src/common/entities/user.entity';

@Entity('refresh_tokens')
@Unique(['user']) // ensures only one token per user
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  token: string;

  @OneToOne(() => User, (user) => user.refreshToken, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn()
  user: User;

  @Column({ type: 'timestamp' })
  expiryDate: Date;

  @Column({ type: 'enum', enum: Roles })
  role: Roles;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
