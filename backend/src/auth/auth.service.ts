import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt.interface';
import { AuthTokens } from './interfaces/jwt.interface';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  login(createAuthDto: LoginDto) {
    const payload = { name: createAuthDto.name, email: createAuthDto.email };
    return this.generateTokens(payload);
  }

  refresh(refreshToken: RefreshDto): AuthTokens {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken.refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'JWT_REFRESH_SECRET',
      });

      return this.generateTokens({
        name: payload.name,
        email: payload.email,
      });
    } catch {
      throw new UnauthorizedException('Refresh token inválido o expirado.');
    }
  }

  private generateTokens(payload: JwtPayload): AuthTokens {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'JWT_SECRET',
      expiresIn: '10m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'JWT_REFRESH_SECRET',
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
}
