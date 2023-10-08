import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminController } from "./admin.controller";
import { AdminService } from "./adminservice.service";

import { MailerModule } from "@nestjs-modules/mailer";
import { AdminEntity } from "./adminentity.entity";
import { UserEntity } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { UserController } from "src/user/user.controller";

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        ignoreTLS: true,
        secure: true,
        auth: {
          user: 'your email address',
          pass: 'your app password',
        },
      },
    }),
    TypeOrmModule.forFeature([AdminEntity, UserEntity]), // Updated references to UserEntity
  ],
  controllers: [AdminController,UserController],
  providers: [AdminService, UserService], // Updated provider name to UserService
})
export class AdminModule {}
