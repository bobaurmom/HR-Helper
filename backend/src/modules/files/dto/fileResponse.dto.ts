import { ApiProperty } from '@nestjs/swagger';

export class FileResponseDto {
    createdAt!: Date;
    updatedAt!: Date;

    @ApiProperty({
        description: 'The unique identifier of the file',
        example: 1,
    })
    fileId!: number;

    @ApiProperty({
        description: 'The key of the file in the storage system',
        example: 'uploads/avatar.pdf',
    })
    key!: string;

    @ApiProperty({
        description: 'The name of the file',
        example: 'avatar.pdf',
    })
    filename!: string;

    @ApiProperty({
        description: 'The MIME type of the file',
        example: 'application/pdf',
    })
    contentType!: string;

    constructor(partial: Partial<FileResponseDto>) {
        Object.assign(this, partial);
        return this;
    }
}