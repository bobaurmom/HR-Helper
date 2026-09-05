import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FormsService } from '../forms/forms.service';
import { SubmitFormDto } from './dto/submit-form.dto';

@Injectable()
export class FormSubmissionsService {
  constructor(
    private prisma: PrismaService,
    private formsService: FormsService,
  ) {}

  async submit(formId: string, dto: SubmitFormDto) {
    const form = await this.formsService.findOne(formId);
    if (!form) {
      throw new NotFoundException('Form not found');
    }

    const now = new Date();

    // Check if the form has a start time and hasn't opened yet
    if (form.openAt && now < form.openAt) {
      throw new BadRequestException('Form is not open yet');
    }

    // Check if the form has an end time and has already closed
    if (form.closeAt && now > form.closeAt) {
      throw new BadRequestException('Form submission period has ended');
    }

    // Validate required fields
    for (const field of form.fields) {
      if (field.required) {
        const answer = dto.answers.find((a) => a.fieldId === field.id);
        if (!answer || (!answer.value && !answer.optionId)) {
          throw new BadRequestException(`Field ${field.label} is required`);
        }
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const submission = await tx.formSubmission.create({
        data: {
          formId: formId,
          cvFileId: dto.cvFileId,
          answers: {
            create: dto.answers.map((answer) => ({
              fieldId: answer.fieldId,
              value: answer.value,
              optionId: answer.optionId,
            })),
          },
        },
      });
      return submission;
    });
  }

  async findOne(id: number, userId: number) {
    const submission = await this.prisma.formSubmission.findUnique({
      where: { id },
      include: {
        form: {
          include: {
            fields: {
              include: {
                options: true,
              },
            },
          },
        },
        answers: {
          include: {
            field: true,
            option: true,
          },
        },
        cvFile: true,
      },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    if (submission.form.userId !== userId) {
      throw new ForbiddenException('You do not have permission to view this submission');
    }

    return submission;
  }

  async findAllByFormId(formId: string, userId: number) {
    const form = await this.prisma.form.findUnique({ where: { id: formId } });
    if (!form || form.userId !== userId) {
      throw new ForbiddenException('You do not have permission to view submissions for this form');
    }

    return this.prisma.formSubmission.findMany({
      where: { formId },
      include: {
        cvFile: true,
        answers: true,
      },
    });
  }
  
  async delete(submissionId: number, userId: number) {
    const submission = await this.prisma.formSubmission.findUnique({
      where: { id: submissionId },
      include: { form: true },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    if (submission.form.userId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this submission');
    }

    return this.prisma.formSubmission.delete({
      where: { id: submissionId },
    });
  }
}
