import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateScheduleDto {
  @ApiProperty({
    description: 'The ISO date string when the form should close, or null to clear the close time (form becomes permanently open)',
    example: '2026-09-10T17:00:00.000Z',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsDateString()
  closeAt!: string | null;
}

export class UpdateStatusDto {
  @ApiProperty()
  @IsBoolean()
  isOpen!: boolean;
}
