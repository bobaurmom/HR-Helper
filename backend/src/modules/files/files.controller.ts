import { Controller, Post, Get, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { CreateUploadUrlDto } from './dto/createUploadUrl.dto';
import { CreateFileRecordDto } from './dto/createFileRecord.dto';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  @ApiOperation({ summary: 'Check files service status' })
  @ApiResponse({ status: 200, description: 'Service is running.' })
  async getHello(): Promise<string> {
    return 'Files service is running!';
  }

  @Post()
  @ApiOperation({ summary: 'Create a file record in the database' })
  @ApiResponse({ status: 201, description: 'File record created successfully.' })
  async createFileRecord(@Body() dto: CreateFileRecordDto) {
    return this.filesService.createFileRecord(dto.key);
  }

  @Post('presigned-url')
  @ApiOperation({ summary: 'Create a pre-signed upload URL for S3' })
  @ApiResponse({ status: 201, description: 'Pre-signed URL created successfully.' })
  async createUploadUrl(@Body() dto: CreateUploadUrlDto) {
    return this.filesService.getPresignedUrl(dto.filename, dto.filesize);
  }


}