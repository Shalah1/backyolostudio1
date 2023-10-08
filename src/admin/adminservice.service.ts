import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminEntity } from "./adminentity.entity";
import { AdminForm } from "./adminform.dto";
import { AdminFormUpdate } from "./adminformupdate.dto";
import { MailerService } from "@nestjs-modules/mailer/dist";

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(AdminEntity)
        private adminRepo: Repository<AdminEntity>,
        private mailerService: MailerService
    ) {}

    getIndex(): any { 
        return this.adminRepo.find();
    }

    async getUserByID(id) {
        const data = await this.adminRepo.findOne(id);
        console.log(data);
        if (data !== null) {
            return data;
        } else {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
    }

    getUserByIDName(qry): any {
        return this.adminRepo.findOne({
            where: { id: qry.id, name: qry.name }
        });
    }
    
    async insertUser(mydto) {
        // No password hashing
        return this.adminRepo.save(mydto);
    }

    updateUser(name, email): any {
        return this.adminRepo.update({ email: email }, { name: name });
    }

    updateUserbyid(mydto: AdminFormUpdate, id): any {
        return this.adminRepo.update(id, mydto);
    }

    deleteUserbyid(id): any {
        return this.adminRepo.delete(id);
    }

    getUsersByAdminID(id): any {
        return this.adminRepo.find({ 
            where: { id: id },
            relations: {
                users: true,
            },
        });
    }

    async getUserByEmail(email: string): Promise<AdminEntity | undefined> {
        return this.adminRepo.findOne({ where: { email } });
    }

    async signup(mydto) {
        // No password hashing
        return this.adminRepo.save(mydto);
    }

    async signin(mydto: AdminForm) {
        console.log(`Email: ${mydto.email}, Password: ${mydto.password}`);
        const adminData = await this.adminRepo.findOne({ where: { email: mydto.email } });
    
        if (adminData) {
            console.log(`Stored Password: ${adminData.password}`);
            // Compare plain text passwords
            if (mydto.password === adminData.password) {
                // Password is correct
                return 1;
            }
        }
    
        // Password is incorrect
        console.log("Invalid user please re-login"); 
        return 0;
    }
    

    async sendEmail(mydata){
        return await this.mailerService.sendMail({
            to: mydata.email,
            subject: mydata.subject,
            text: mydata.text, 
        });
    }
}
