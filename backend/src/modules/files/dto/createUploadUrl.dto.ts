import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class CreateUploadUrlDto {
  @ApiProperty({
    description: 'The name of the file to upload',
    example: 'avatar.png',
  })
  @IsString()
  @IsNotEmpty()
  filename!: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 1024,
  })
  @IsNumber()
  @Min(1)
  @Max(1024 * 1024 * 10)
  filesize!: number;
}
