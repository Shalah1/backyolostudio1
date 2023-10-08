import { IsNotEmpty, IsInt, Length } from "class-validator";

export class AdminFormUpdate {   
   
   @Length(1,10)
    name: string;



}