import { Module } from '@nestjs/common';
import { FormSubmissionsController } from './form-submissions.controller';
import { FormSubmissionsService } from './form-submissions.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { FormsModule } from '../forms/forms.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, FormsModule, AuthModule],
  controllers: [FormSubmissionsController],
  providers: [FormSubmissionsService],
})
export class FormSubmissionsModule {}
