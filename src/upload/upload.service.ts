import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class UploadService {
  constructor(@InjectQueue('upload-queue') private uploadQueue: Queue) {}

  async addToQueue(data: any) {
    console.log('service', data);
    //生产者
    const job = await this.uploadQueue.add(data);
    //消费完拿到结果，也可以和nodejs-redis配合去拿东西
    const result = await job.finished();
    return result;
  }
}
