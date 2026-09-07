// src/modules/email/email.controller.ts
import { Controller, Post, Body, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { EmailService } from './email.service';
import { JwtAuthGuard } from '../auth/auth.middleware';

@Controller('email')
@UseGuards(JwtAuthGuard)
export class EmailController {
    constructor(private readonly emailService: EmailService) {}

    @Post('send-template')
    async sendTemplateEmail(
        @Req() req: any,
        @Body('to') to: string,
        @Body('subject') subject: string,
        @Body('templateName') templateName: string,
        @Body('context') context: Record<string, any>,
    ) {
        const userAccessToken = req.user.googleAccessToken;
        if (!userAccessToken) {
            throw new UnauthorizedException('Google access token is missing. Please sign in again.');
        }

        return await this.emailService.sendTemplatedEmail(
            userAccessToken, 
            to, 
            subject, 
            templateName, 
            context
        );
    }
}