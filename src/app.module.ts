import { BullModule } from '@nestjs/bull';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExampleModule } from './example/example.module';
import { MiddleMiddleware } from './middle/middle.middleware';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from 'nestjs-redis';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ExampleModule,
    UserModule,
    DatabaseModule,
    //nodejs-redis
    RedisModule.register({
      url: 'redis://127.0.0.1:6379/4',
    }),
    //bull
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
