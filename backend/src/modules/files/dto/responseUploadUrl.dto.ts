import { ApiProperty } from '@nestjs/swagger';


export class ResponseUploadUrlDto {
  @ApiProperty({
    description: 'The URL to which the file can be uploaded',
    example: 'https://example.com/upload-url',
  })
  uploadUrl!: string;

  @ApiProperty({
    description: 'The key of the uploaded file in the storage system',
    example: 'uploads/avatar.pdf',
  })
  key!: string;
}