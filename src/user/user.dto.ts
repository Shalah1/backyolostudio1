import { IsNotEmpty, Length, IsEmail } from "class-validator";

export class UserForm {

  @IsNotEmpty()
  nameU: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(1, 255) // Adjust the length as needed
  password: string;

  @IsNotEmpty()
  address: string;

  adminid: number;

  // Add any other properties specific to your user DTO
}
