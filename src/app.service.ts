import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
@Injectable()
export class AppService {
  constructor(private readonly redisService: RedisService) {}

  async setValue(key: string, value: string) {
    const client = this.redisService.getClient();
    await client.set(key, value);
  }

  async getValue(key: string) {
    const client = this.redisService.getClient();
    const value = await client.get(key);
    console.log(value);
    return value;
  }
}
