import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { HealthController } from './common/health.controller';

@Module({
  imports: [PrismaModule],
  controllers: [HealthController],
})
export class AppModule {}
