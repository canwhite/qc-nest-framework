## qc-nest-fw

## why
```
用nest方便JS或者TS一把梭，
实现原理和语法跟Spring Boot和Angular很像，
所以有以上经验的人可以很快入门
```

## generate
```
nest generate module example
nest generate controller example
nest generate service example
nest generate pipe example
nest generate middleware example
nest generate filter example
nest generate interceptor example
nest generate guard example
```

## what 
* Middleware: 在路由处理程序之前执行，通常用于执行一些全局的任务，比如日志记录、请求预处理等。
* Guards: 在中间件之后、路由处理程序和拦截器之前执行，主要用于权限验证和授权。
* Interceptors: 在守卫之后、路由处理程序之前执行，可以用于绑定额外的逻辑，如转换返回结果、绑定额外的逻辑到方法的执行之前或之后、扩展基本方法行为等。
* Pipes: 可以在参数处理时执行，如数据转换和验证。
* Route Handler: 实际的控制器方法，在这里执行请求的主要逻辑。
* Filters: 在路由处理程序之后执行，用于捕获和处理异常。

关键概念Provider：
1. 定义
```
定义Provider类：
首先，你需要创建一个Provider类;
----
在Nest中，Provider是一个通用的术语，用于描述应用程序中的各种组件，比如服务、存储库、工厂等。Provider的作用是为应用程序的其他部分提供特定的功能或值。它们解决了应用程序中的依赖注入和模块化的问题。
----
import { Injectable } from '@nestjs/common';

@Injectable()
export class MyService {
  // Provider 类的代码
}
```
2. 将Provider添加到模块中
```
import { Module } from '@nestjs/common';
import { MyService } from './my.service';

@Module({
  providers: [MyService],
})
export class MyModule {}
```
3. 在其他组件中使用Provider
```
import { Injectable } from '@nestjs/common';
import { MyService } from './my.service';

@Injectable()
export class MyController {
  constructor(private readonly myService: MyService) {}

  // 在控制器中使用 MyService Provider
}

```


## how 

* middleware - example中有完整的的全局和模块使用的方法
```
1）全局实例use
2）模块apply
```

* @UseGuards
```
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(request: Request): boolean {
    // 这里应该有一个真实的验证逻辑，这里仅作为示例
    return request.headers.authorization === 'some-secret-token';
  }
}

//使用
//绑定全局
// app.module.ts
@Module({
  providers: [
    {
      provide: APP_GUARD, // 使用 APP_GUARD 令牌
      useClass: AuthGuard, // 将 AuthGuard 声明为全局的 Guard
    },
    AuthService,
  ],
})
export class AppModule {}

// 绑定到控制器
@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  // ...
}

// 绑定到路由处理程序
@Controller('users')
export class UsersController {
  @Get(':id')
  @UseGuards(AuthGuard)
  getUserById(@Param('id') id: string) {
    // ...
  }
}


```

* @UseInterceptors
```
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => console.log(`After... ${Date.now() - now}ms`))
      );
  }
}

//使用

//全局
@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}


// 绑定到控制器或路由处理程序
@Controller()
@UseInterceptors(LoggingInterceptor)
export class SomeController {
  @Get()
  
  @UseInterceptors(LoggingInterceptor)
  findAll() {
    // ...
  }
}


```

* @UsePipes()

```
// src/example/example.pipe.ts

import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ExamplePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // 这里可以对输入数据进行转换或验证
    return value;
  }
}

//--路由方法中使用

import { Controller, Get, UsePipes } from '@nestjs/common';
import { ExamplePipe } from './example.pipe';

@Controller('example')
export class ExampleController {
  @Get()
  @UsePipes(ExamplePipe)
  getHello(): string {
    return 'Hello from ExampleController!';
  }
}

//--当然也可以用来处理参数
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidateStringLengthPipe implements PipeTransform<string> {
  constructor(private readonly minLength: number) {}

  transform(value: string, metadata: ArgumentMetadata): string {
    if (value.length < this.minLength) {
      throw new BadRequestException(`The string is too short. Should be at least ${this.minLength} characters long.`);
    }
    return value;
  }
}

@Controller('cats')
export class CatsController {
  @Post()
  async create(@Body(new ValidateStringLengthPipe(10)) body: string) {
    // ...
  }
}



```

* @UseFilters
```
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: exception.message || null,
    };

    response
      .status(status)
      .json(errorResponse);
  }
}

//how to use
// 绑定到全局
import { Module } from '@nestjs/common';

@Module({
  // ...
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
  ],
})
export class AppModule {}

// 绑定到控制器
@Controller('some-route')
@UseFilters(HttpErrorFilter)
export class SomeController {
  // ...
}

// 绑定到路由处理程序
@Controller('some-route')
export class SomeController {
  @Get()
  @UseFilters(HttpErrorFilter)
  findSomeRoute() {
    // ...
  }
}

```

* Custom Decorators - SetMetadata And createParamDecorator
```

import { SetMetadata, createParamDecorator } from '@nestjs/common';

//1)SetMetadata
export const CustomDecorator = (value: string) => SetMetadata('custom-key', value);

2)createParamDecorator
export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user; // 假设请求已经通过某个中间件添加了`user`属性
  },
);

import { Controller, Get } from '@nestjs/common';
import { CustomDecorator, GetUser } from './custom.decorator';

@Controller('example')

export class ExampleController {


  @Get(':id')
  @CustomDecorator('example-value')
  getExample(@GetUser() user): string {

    // 在这里可以使用元数据或参数
    const customValue = Reflect.getMetadata('custom-key', this.getExample);
    console.log(`Custom metadata value: ${customValue}`);
    console.log(`Custom parameter value: ${id}`);

    return user;
  }
}


```

## typeorm

1. 引入依赖
```
//注意引入mysql2，正常mysql容易没有连接权限
yarn add  @nestjs/typeorm typeorm mysql2

//创建对应的database，nest不具有这个能力
create database nest_test

```
2. 创建一个数据库实体
   
```
//安装全局typeorm
npm i typeorm -g
//执行命令创建
typeorm entity:create src/entities/User

//修改使用
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;
}
```
3. 配置typeorm
```
//创建一个用于配置的database module，会被自动注册到
nest generate module database


//具体配置
import { User } from 'src/entities/User';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    //root
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'xxx',
      database: 'nest_test',
      //__dirname是database内，然后..往父文件夹src去，然后进一步匹配
      entities: [__dirname + '/../**/*.{js,ts}'],
      // entities: [User],
      logging: true, // 开启日志
      synchronize: true,
      connectorPackage: 'mysql2',
    }),
    //feature，这个需要到用的模块中去配置
    //TypeOrmModule.forFeature([User]),
  ],
})
export class DatabaseModule {}


```
4. 使用
```
//首先在User的module中注入feature

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}


//然后service具体使用
import { User } from './../entities/User';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class UserService {
  //注入Repository
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  //methods,注意repository方法返回的都是Promise
  async findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: string) {
    return this.usersRepository.findOne({ where: { id: id } });
  }

  async create(user: User) {
    return this.usersRepository.save(user);
  }

  async update(user: User) {
    return this.usersRepository.save(user);
  }

  async remove(id: string) {
    return this.usersRepository.delete(id);
  }
}

```

## redis

1. 安装nodejs-redis
```
yarn add skunight/nestjs-redis redis
yarn add @types/ioredis
```
2. 创建一个Redis客户端并将其注入到NestJS服务中
```
import { Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis';
import { AppController } from './app.controller';
import { AppService } from './app.service’;

@Module({
  imports: [
    RedisModule.register({
      //redis://127.0.0.1:6379/4 没有密码类型的
      url: 'redis://:authpassword@127.0.0.1:6379/4’,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

--PS:

1. redis:// - 连接协议，表示使用的是Redis协议。
2. authpassword - Redis数据库的认证密码，用于连接到数据库时进行身份验证。
3. 127.0.0.1 - Redis数据库所在的主机IP地址，这里是本地主机的IP地址。
4. 6380 - Redis数据库的端口号，这里是指定的端口号。
5. /4 - Redis数据库的索引，表示要连接的是第四个数据库。

在Redis中，默认情况下有16个数据库（从0到15），你可以使用INFO命令来查看有关Redis实例的各种信息，包括数据库的情况。具体步骤如下：

看下你的redis端口
ps aux | grep redis 
我的是127.0.0.1:6379

```
3. 在服务中使用Redis示例：
```
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
    return value;
  }
}

```
4. 在控制器中调用服务示例：
```
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  //curl -X POST -H "Content-Type: application/json" -d '{"key": "key1", "value": "Hello"}' http://127.0.0.1:3000
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

```


## todo 
* queue
* micro services

