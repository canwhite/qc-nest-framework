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
      password: '715705@Qc123',
      database: 'nest_test',
      //
      entities: [__dirname + '/../**/*.{js,ts}'],
      // entities: [User],
      logging: true, // 开启日志
      synchronize: true,
      connectorPackage: 'mysql2',
    }),
    //feature,这个在用到的module配置
    //TypeOrmModule.forFeature([User]),
  ],
})
export class DatabaseModule {}
