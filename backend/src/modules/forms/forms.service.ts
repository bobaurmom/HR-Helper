import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class FormsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateFormDto) {
    return this.prisma.form.create({
      data: {
        title: dto.title,
        description: dto.description,
        requirements: dto.requirements,
        userId: userId,
        fields: {
          create: dto.fields.map((field) => ({
            label: field.label,
            type: field.type,
            required: field.required || false,
            options: {
              create: field.options?.map((opt) => ({
                value: opt.value,
              })),
            },
          })),
        },
      },
      include: {
        fields: {
          include: {
            options: true,
          },
        },
      },
    });
  }

  async findAllByUserId(userId: number) {
    const forms = await this.prisma.form.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { submissions: true },
        },
      },
    });

    return forms.map((form) => ({
      ...form,
      submissionCount: form._count.submissions,
    }));
  }

  async findOne(id: number) {
    const form = await this.prisma.form.findUnique({
      where: { id },
      include: {
        fields: {
          include: {
            options: true,
          },
        },
        _count: {
          select: { submissions: true },
        },
      },
    });

    if (!form) return null;

    return {
      ...form,
      submissionCount: form._count.submissions,
    };
  }

  async update(id: number, userId: number, dto: UpdateFormDto) {
    const form = await this.prisma.form.findUnique({ where: { id } });
    if (!form || form.userId !== userId) {
      throw new ForbiddenException('You do not have permission to edit this form');
    }

    const hasSubmissions = await this.prisma.formSubmission.count({
      where: { formId: id },
    });

    if (hasSubmissions > 0) {
      throw new ForbiddenException('Cannot edit a form that has received submissions');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Delete all existing fields (options will cascade delete)
      await tx.field.deleteMany({
        where: { formId: id },
      });

      // 2. Recreate the form fields and options
      return tx.form.update({
        where: { id },
        data: {
          title: dto.title,
          description: dto.description,
          requirements: dto.requirements,
          fields: {
            create: dto.fields.map((field) => ({
              label: field.label,
              type: field.type,
              required: field.required || false,
              options: {
                create: field.options?.map((opt) => ({
                  value: opt.value,
                })),
              },
            })),
          },
        },
        include: {
          fields: {
            include: {
              options: true,
            },
          },
        },
      });
    });
  }

  async copy(id: number, userId: number) {
    const originalForm = await this.prisma.form.findUnique({
        where: { id },
        include: {
            fields: { include: { options: true } }
        }
    });
    
    if (!originalForm) {
      throw new NotFoundException('Form not found');
    }

    return this.prisma.form.create({
      data: {
        title: `Copy of ${originalForm.title}`,
        description: originalForm.description,
        requirements: originalForm.requirements,
        userId: userId,
        isOpen: false,
        fields: {
          create: originalForm.fields.map((field) => ({
            label: field.label,
            type: field.type,
            required: field.required,
            options: {
              create: field.options.map((opt) => ({
                value: opt.value,
              })),
            },
          })),
        },
      },
      include: {
        fields: {
          include: {
            options: true,
          },
        },
      },
    });
  }

  async updateStatus(id: number, userId: number, isOpen: boolean) {
    const form = await this.prisma.form.findUnique({ where: { id } });
    if (!form || form.userId !== userId) {
        throw new ForbiddenException('You do not have permission to edit this form');
    }

    try {
      return await this.prisma.form.update({
        where: { id },
        data: { isOpen },
      });
    } catch (error: any) {
      if (error?.code === 'P2025') {
        throw new NotFoundException(`Form with ID ${id} not found`);
      }
      throw error;
    }
  }

  async delete(id: number, userId: number) {
    const form = await this.prisma.form.findUnique({ where: { id } });
    if (!form || form.userId !== userId) {
        throw new ForbiddenException('You do not have permission to delete this form');
    }

    try {
      return await this.prisma.form.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error?.code === 'P2025') {
        throw new NotFoundException(`Form with ID ${id} not found`);
      }
      throw error;
    }
  }
}
