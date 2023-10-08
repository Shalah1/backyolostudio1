import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin/adminmodule.module';
import { UserModule } from './user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [AdminModule, UserModule, TypeOrmModule.forRoot(
   { type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '123',
    database: 'dataviztracking',
    autoLoadEntities: true,
    synchronize: true,
  }
  ),
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', '../public'), // added ../ to get one folder back
    serveRoot: '/public/' //last slash was important
  }),
],
  controllers: [],
  providers: [],
})
export class AppModule {}