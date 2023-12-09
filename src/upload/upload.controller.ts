import { UploadService } from './upload.service';
import { UploadModule } from './upload.module';
import { Controller, Get, Query } from '@nestjs/common';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Get('/queue')
  async uploadData(@Query() data) {
    return this.uploadService.addToQueue(data);
  }
}
