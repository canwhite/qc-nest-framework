import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  //curl -X POST -H "Content-Type: application/json" -d '{"key": "key1", "value": "Zack"}' http://127.0.0.1:3000
  @Post()
  async setValue(@Body('key') key: string, @Body('value') value: string) {
    return this.appService.setValue(key, value);
  }
  //http://localhost:3000/?key=key1
  @Get()
  async getValue(@Query('key') key: string) {
    return this.appService.getValue(key);
  }
}
