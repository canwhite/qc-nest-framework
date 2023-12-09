import { MiddleMiddleware } from './middle/middle.middleware';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //PS：这样相当于全局使用中间件
  //如果是在某个模块中使用，请看example中的module
  app.use(new MiddleMiddleware().use);
  await app.listen(3000);
}
bootstrap();
