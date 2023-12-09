import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ExampleService } from './example.service';
import { ExampleController } from './example.controller';
import { MiddleMiddleware } from 'src/middle/middle.middleware';

@Module({
  providers: [ExampleService],
  controllers: [ExampleController],
})
// PS: 这里不用加了，因为中间件已经全局导入了
//implements NestModule
export class ExampleModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(MiddleMiddleware).forRoutes('*'); // 应用到所有的路由
  // }
}
