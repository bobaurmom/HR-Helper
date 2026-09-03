import { ApiProperty } from '@nestjs/swagger';

export class SubmissionResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  formId!: number;

  @ApiProperty()
  cvFileId!: number;

  @ApiProperty()
  createdAt!: Date;
}
