import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { AuthLoginDto, AuthRegisterDto } from '@monorepo-shop/shared';
import { User, Role } from '../../entities';
import { hashPassword, verifyPassword } from '../../common/utils/password';
import {
  ConflictException,
  NotFoundException,
  AuthenticationException,
  ValidationException,
} from '../../common/exceptions/api.exception';

export type JwtPayload = {
  sub: number;
  email: string;
};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly jwtService: JwtService,
  ) {}

  private async ensureDefaultRoleId(): Promise<number> {
    let role = await this.roleRepository.findOne({
      where: { name: 'user' },
      select: ['id'],
    });

    if (!role) {
      role = await this.roleRepository.save({ name: 'user' });
    }

    return role.id;
  }

  async register(dto: AuthRegisterDto) {
    const email = dto.email?.trim().toLowerCase();
    if (!email || !dto.password) {
      throw new ValidationException('Email và password là bắt buộc');
    }

    const existing = await this.userRepository.findOne({
      where: { email },
      select: ['id'],
    });

    if (existing) {
      throw new ConflictException('Email đã tồn tại');
    }

    const roleId = await this.ensureDefaultRoleId();
    const passwordHash = await hashPassword(dto.password);

    const user = await this.userRepository.save({
      email,
      password: passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      address: dto.address,
      roleId,
    });

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    } as JwtPayload);

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, accessToken };
  }

  async login(dto: AuthLoginDto) {
    const email = dto.email?.trim().toLowerCase();
    if (!email || !dto.password) {
      throw new ValidationException('Thông tin đăng nhập không hợp lệ');
    }

    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });

    if (!user) {
      throw new AuthenticationException('Email hoặc password không đúng');
    }

    const ok = await verifyPassword(dto.password, user.password);
    if (!ok) {
      throw new AuthenticationException('Email hoặc password không đúng');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    } as JwtPayload);

    return { accessToken };
  }

  async me(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'phone',
        'address',
        'roleId',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }

    return user;
  }
}
