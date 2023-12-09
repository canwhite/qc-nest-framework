import { ExamplePipe } from './example.pipe';
import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { ExampleService } from './example.service';

@Controller('example')
export class ExampleController {
  //constrictor inject service
  constructor(private readonly exampleService: ExampleService) {}

  @Get('/getSay')
  getExample(@Query('say') say: string) {
    return this.exampleService.getExample(say);
  }

  /**
   curl -X POST -H "Content-Type: application/json" -d '{"hello":"hello"}' http://localhost:3000/example/postSay
   */
  @Post('/postSay')
  @UsePipes(ExamplePipe)
  postExample(@Body('hello') hello: string) {
    return this.exampleService.postExample(hello);
  }

  /** 
   * @Post()
    async create(@Body() data: any) {
      // 使用data变量来访问整个传入的参数
      console.log(data);
    }
   */
}
