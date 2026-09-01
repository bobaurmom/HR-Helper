import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './auth.helper';
import { PrismaModule } from '../../prisma/prisma.module';
import { authConfig } from './auth.config';

@Module({
    imports: [
        PrismaModule,
        PassportModule,
        JwtModule.register({
            secret: authConfig.jwtSecret,
            signOptions: { expiresIn: '8h' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, GoogleStrategy],
    exports: [JwtModule],
})
export class AuthModule {}