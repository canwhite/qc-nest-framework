import { Injectable } from '@nestjs/common';

//通过 @Injectable 装饰器将服务类注册到 IoC 容器中：
@Injectable()
export class ExampleService {
  //GET
  getExample(say: string) {
    return say;
  }
  //POST
  postExample(hello: string) {
    return hello;
  }
}
