import { Controller, Body, Post, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/loginDto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('login')
    login(@Body() loginDto: LoginDTO) {
        return this.authService.authenticate(loginDto);
    }

    /* IZBRISAT KASNIJE */
    @Get('users')
    getUsers() {
        return this.authService.getUsers();
    }
}
