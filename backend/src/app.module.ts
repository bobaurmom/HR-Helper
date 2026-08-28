import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { FilesModule } from './modules/files/files.module';
import { HealthController } from './common/health.controller';

@Module({
  imports: [PrismaModule, FilesModule],
  controllers: [HealthController],
})
export class AppModule {}
