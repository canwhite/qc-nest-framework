import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('upload-queue')
export class UploadProcessor {
  @Process()
  async processUpload(job: Job<any>) {
    // 消费者
    // const result = await someTimeConsumingOperation(job.data);
    console.log('procress', job.data);
    return 'hello';
  }
}
