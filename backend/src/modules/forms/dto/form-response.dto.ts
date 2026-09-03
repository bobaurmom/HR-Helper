import { ApiProperty } from '@nestjs/swagger';

export class FormResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  requirements?: string;

  @ApiProperty()
  isOpen!: boolean;

  @ApiProperty()
  userId!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty()
  submissionCount?: number;
}
