import { IsNotEmpty, IsInt, Length, IsEmail } from "class-validator";

export class AdminForm {   
   

   @IsNotEmpty()
    name: string;
   
   @IsEmail() 
    email: string;

    @Length(1,8)
    password: string;

    address: string;

    filename :string;


}