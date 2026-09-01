// src/modules/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) {}

    async validateGoogleUser(details: { email: string; name: string; avatar?: string; googleId: string }) {
        let user = await this.prisma.user.findUnique({
            where: { email: details.email },
        });

        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    email: details.email,
                    name: details.name,
                    googleId: details.googleId,
                },
            });
        }

        const payload = { id: user.id, email: user.email, role: 'HR' };
        const token = this.jwtService.sign(payload);

        return { user, accessToken: token };
    }
}