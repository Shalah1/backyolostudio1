// user.controller.ts
import { Controller, Post, Body, UploadedFile, UseInterceptors, UnauthorizedException, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Session, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { UserForm } from './user.dto';
import { diskStorage } from 'multer';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Post('/insertuser') // Rename to insertuser
  // @UsePipes(new ValidationPipe())
  insertUser(@Body() userdto: UserForm): any {
    return this.userService.insertUser(userdto);
  }

  @Post('register')
  @UseInterceptors(FileInterceptor('csvFile'))
  async registerUserWithCSV(
    @Body() userdto: UserForm,
    @UploadedFile() csvFile: Express.Multer.File,
  ) {
    // Assuming UserForm and UserEntity classes are defined elsewhere
    const newUser = await this.userService.registerUser(userdto);
    if (csvFile) {
      // Process the CSV file as needed, e.g., save it or parse it
      // Here, we'll just return the filename for demonstration purposes
      return { message: 'User registered successfully', user: newUser, csvFileName: csvFile.filename };
    }
    return { message: 'User registered successfully', user: newUser };
  }
  @Post('/signup')
  signup(@Body() mydto: UserForm) {
    console.log(mydto);
    return this.userService.signup(mydto);
  }

@Post('/signin')
async signin(@Session() session, @Body() mydto: UserForm) {
  const result = await this.userService.signin(mydto);

  if (result === 1) {
      session.email = mydto.email;
      return { message: "success" };
  } else {
      throw new UnauthorizedException({ message: "invalid credentials please re log in or register" });
  }
}

  @Get('/signout')
  signout(@Session() session) {
    if (session.destroy()) {
      return { message: "you are logged out" };
    } else {
      throw new UnauthorizedException("invalid actions");
    }
  }

}


