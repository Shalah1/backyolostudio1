
import { UserForm } from "./user.dto"; // Update the import for the DTO
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import { UserEntity } from "./user.entity"; // Update the import for the entity

import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MailerService } from "@nestjs-modules/mailer/dist";
@Injectable()
export class UserService {

  parseAndProcessCSV(csvFile: Express.Multer.File) {
    throw new Error('Method not implemented.');
  } // Rename the class to UserService
    constructor(
        @InjectRepository(UserEntity) // Update the repository injection
        private userRepo: Repository<UserEntity>, // Rename the variable
      ) {}

    insertUser(userDto: UserForm): any { // Update method name and parameter
        return this.userRepo.save(userDto); // Update the repository method call
    }



    getAdminByUserId(id): any { // Update method name and parameter
        return this.userRepo.find({
            where: { id: id },
            relations: {
                admin: true,
            },
        });
    }


    async registerUser(userdto: UserForm): Promise<UserEntity> {
        // Create a new user and save it to the database
        const newUser = this.userRepo.create(userdto);
        return this.userRepo.save(newUser);
      }
    
      // async processAndAssociateCSVData(newUser: UserEntity, parsedData: any[]): Promise<void> {
      //   // Implement the logic to associate the parsed CSV data with the user.
      //   // This could involve saving the CSV data to a related entity or performing other actions.
    
      //   // For example, if you have a related entity 'UserData' that represents CSV data associated with a user:
      //   for (const data of parsedData) {
      //     const userData = new UserEntity(); // Create a new instance of 'UserDataEntity'
      //     // userData.user = newUser; // Associate the user with the CSV data
      //     userData.filename = data.filename; // Set other properties based on the parsed data
      //     await userData.save(); // Save the 'userData' entity to your database
      //   }
      // }

      async getUserByEmail(email: string): Promise<UserEntity | undefined> {
        return this.userRepo.findOne({ where: { email } });
    }

    async signup(mydto) {
        // No password hashing
        return this.userRepo.save(mydto);
    }

    async signin(mydto: UserForm) {
        console.log(`Email: ${mydto.email}, Password: ${mydto.password}`);
        const userData = await this.userRepo.findOne({ where: { email: mydto.email } });
    
        if (userData) {
            console.log(`Stored Password: ${userData.password}`);
            // Compare plain text passwords
            if (mydto.password === userData.password) {
                // Password is correct
                return 1;
            }
        }
    
        // Password is incorrect
        console.log("Invalid user please re-login"); 
        return 0;
    }
  }

    
