import { Controller, Get, Req, UseGuards, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req: Request) {
        // Initiates the Google OAuth redirection
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req: Request & { user: any }, @Res() res: Response) {
        const { accessToken } = req.user;
        
        return res.redirect(`http://localhost:3000/dashboard?token=${accessToken}`);
    }
}