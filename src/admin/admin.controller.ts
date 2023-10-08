import {
    Body,
    Controller,
    Delete,
    FileTypeValidator,
    Get,
    MaxFileSizeValidator,
    Param,
    ParseFilePipe,
    ParseIntPipe,
    Post,
    Put,
    Query,
    UploadedFile,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
    Session,
    UseGuards,
    Res,
    Header,
    HttpCode,
    HttpStatus
  } from '@nestjs/common';
  
  import { HttpException, UnauthorizedException } from '@nestjs/common/exceptions';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import * as multer from 'multer';
  import * as bcrypt from 'bcrypt';
  import { UserForm } from 'src/user/user.dto'; // Replace with UserForm
  import { UserService } from 'src/user/user.service'; // Replace with UserService
  import { AdminForm } from './adminform.dto';
  import { AdminFormUpdate } from './adminformupdate.dto';
  import { AdminService } from './adminservice.service';
  import { SessionGuard } from './session.guard';
  
  @Controller('/admin')
  export class AdminController {
    constructor(
      private adminService: AdminService,
      private userService: UserService // Replace with UserService
    ) {}
  
    @Get('/index')
    getAdmin(): any {
      return this.adminService.getIndex();
    }
    
    @Get('/findadmin/:id')
    getAdminByID(@Param('id', ParseIntPipe) id: number): any {
      return this.adminService.getUserByID(id);
    }
  
    @Get('/findadmin')
    getAdminByIDName(@Query() qry: any): any {
      return this.adminService.getUserByIDName(qry);
    }
  
    @Post('/insertadmin')
    @UseInterceptors(FileInterceptor('myfile',
    {storage:diskStorage({
      destination: './uploads',
      filename: function (req, file, cb) {
        cb(null,Date.now()+file.originalname)
      }
    })
    }))
    insertAdmin(@Body() mydto:AdminForm,@UploadedFile(  new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 6000000 }),
        new FileTypeValidator({ fileType: 'png|jpg|jpeg|' }),
      ],
    }),) file: Express.Multer.File){
    
    mydto.filename = file.filename;  
    console.log(mydto)
    return this.adminService.insertUser(mydto);
    }
  
    @Put('/updateadmin/')
    @UseGuards(SessionGuard)
    @UsePipes(new ValidationPipe())
    updateAdmin(@Session() session,@Body('name') name: string): any {
      console.log(session.email);
      return this.adminService.updateUser(name, session.email);
    }
  
    @Put('/updateadmin/:id')
    @UsePipes(new ValidationPipe())
    updateAdminbyid(
      @Body() mydto: AdminFormUpdate,
      @Param('id', ParseIntPipe) id: number,
    ): any {
      return this.adminService.updateUserbyid(mydto, id);
    }
  
    @Delete('/deleteadmin/:id')
    deleteAdminbyid(@Param('id', ParseIntPipe) id: number): any {
      return this.adminService.deleteUserbyid(id);
    }
  
    @Post('/insertuser') // Rename to insertuser
    @UsePipes(new ValidationPipe())
    insertUser(@Body() userdto: UserForm): any {
      return this.userService.insertUser(userdto);
    }
  
    @Get('/findusersbyadmin/:id') // Rename to findusersbyadmin
    getUsersByAdminID(@Param('id', ParseIntPipe) id: number): any {
      return this.adminService.getUsersByAdminID(id);
    }
  
    @Get('/getimage/:name')
    getImages(@Param('name') name, @Res() res) {
      res.sendFile(name,{ root: './uploads' });
    }
  
    @Get('/findadminbyuser/:id') // Rename to findadminbyuser
    getAdminByUserID(@Param('id', ParseIntPipe) id: number): any {
      return this.userService.getAdminByUserId(id);
    }


    //////////////////////////////

    // @Post('register')
    // @UseInterceptors(FileInterceptor('csvFile'))
    // async registerUserWithCSV(
    //   @Body() userdto: UserForm,
    //   @UploadedFile() csvFile: Express.Multer.File,
    // ) {
    //   // Assuming UserForm and UserEntity classes are defined elsewhere
    //   const newUser = await this.userService.registerUser(userdto);
    //   if (csvFile) {
    //     // Process the CSV file as needed, e.g., save it or parse it
    //     // Here, we'll just return the filename for demonstration purposes
    //     return { message: 'User registered successfully', user: newUser, csvFileName: csvFile.filename };
    //   }
    //   return { message: 'User registered successfully', user: newUser };
    // }
  
    

    /////////////////////////////////
  
    @Post('/signup')
    @UseInterceptors(FileInterceptor('myfile',
    {storage:diskStorage({
      destination: './uploads',
      filename: function (req, file, cb) {
        cb(null,Date.now()+file.originalname)
      }
    })
    }))
    signup(@Body() mydto:AdminForm,@UploadedFile(  new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 160000 }),
        new FileTypeValidator({ fileType: 'png|jpg|jpeg|' }),
      ],
    }),) file: Express.Multer.File){
      mydto.filename = file.filename;  
      console.log(mydto);
      return this.adminService.signup(mydto);
    }
 // @post
//  @Get('/signin')
//  async signin(@Session() session, @Body() mydto: AdminForm) {
//    const userData = await this.adminService.getUserByID(mydto.email);
 
//    if (userData) {
//      const isMatch = await bcrypt.compare(mydto.password, userData.password);
 
//      if (isMatch) {
//        session.email = mydto.email;
//        console.log(session.email);
//        return { message: "success" };
//      }
//    }
 
//    return { message: "invalid credentials" };
//  }



@Post('/signin')
async signin(@Session() session, @Body() mydto: AdminForm) {
    const result = await this.adminService.signin(mydto);

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
  
    @Post('/sendemail')
    sendEmail(@Body() mydata) {
      return this.adminService.sendEmail(mydata);
    }
  }
  