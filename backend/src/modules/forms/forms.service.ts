import { Injectable, NotFoundException } from '@nestjs/common';
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
    return this.prisma.form.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.form.findUnique({
      where: { id },
      include: {
        fields: {
          include: {
            options: true,
          },
        },
      },
    });
  }

  async update(id: number, dto: UpdateFormDto) {
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

  async delete(id: number) {
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

  async updateStatus(id: number, isOpen: boolean) {
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
}
