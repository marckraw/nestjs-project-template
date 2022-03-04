import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');

    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: '1y', // TODO: Definitelly change this, this is no good ! (but its for development)
      secret,
    });

    return {
      access_token,
    };
  }

  async signUp(dto: AuthDto) {
    // generate the password hash
    const hash = await argon.hash(dto.password);

    // save the new user in the db
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      } else {
        throw error;
      }
    }
  }

  async signIn(dto: AuthDto) {
    // find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // if user not exist throw exception
    if (!user) throw new ForbiddenException('Credentials incorrect');

    // compare password
    const passwordMatches = await argon.verify(user.hash, dto.password);

    // if password incorrect throw exception
    if (!passwordMatches) throw new ForbiddenException('Credentials incorrect');

    return this.signToken(user.id, user.email);
  }
}
