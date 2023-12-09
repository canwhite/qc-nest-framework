import { UploadProcessor } from './upload.processor';
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'upload-queue',
    }),
  ],
  providers: [UploadService, UploadProcessor], //单一职责原则
  controllers: [UploadController],
})
export class UploadModule {}
