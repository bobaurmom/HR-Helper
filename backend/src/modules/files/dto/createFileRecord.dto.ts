import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateFileRecordDto {
  @ApiProperty({
    description: 'The key of the file in the storage system',
    example: 'uploads/avatar.pdf',
  })
  @IsString()
  @IsNotEmpty()
  key!: string;
}