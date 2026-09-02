import { Module } from '@nestjs/common';
import { FormsController } from './forms.controller';
import { FormsService } from './forms.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/auth.middleware';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [FormsController],
  providers: [FormsService, JwtAuthGuard],
})
export class FormsModule {}
