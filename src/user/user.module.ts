import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity"; // Update the import to UserEntity

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])], // Update the entity import
  controllers: [],
  providers: [],
})
export class UserModule {} // Rename the class to UserModule
