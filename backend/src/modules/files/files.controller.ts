import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam} from '@nestjs/swagger';
import { FilesService } from './files.service';
import { CreateUploadUrlDto } from './dto/createUploadUrl.dto';
import { CreateFileRecordDto } from './dto/createFileRecord.dto';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

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
    return this.filesService.getPresignedUploadUrl(dto.filename, dto.filesize);
  }

  @Get()
  @ApiOperation({ summary: 'Get all file records' })
  @ApiResponse({ status: 200, description: 'File records retrieved successfully.' })
  async getFile() {
    return this.filesService.getFile();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get file details by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the file record', type: Number })
  @ApiResponse({ status: 200, description: 'File details retrieved successfully.' })
  async getFileById(@Param('id') id: number) {
    return this.filesService.getFileById(id);
  }
}