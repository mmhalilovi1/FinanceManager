import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDTO } from './dto/loginDto';

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService) {}

    // Funkcija za validaciju podataka kada korisnik vrši Login
    async validateUser(loginDto: LoginDTO) {
        const user = await this.prisma.user.findUnique({
            where: {
                name: loginDto.name,
            },
        });
    
        if(!user || user.password_hash != loginDto.password_hash) {
            throw new NotFoundException("Invalid data");
        }

        return {
            userId: user.id,
            username: user.name,
        }
    }

    async authenticate(loginDto: LoginDTO) {
        const user = await this.validateUser(loginDto);

        if(!user) throw new UnauthorizedException();

        return {
            accessToken: "fake-access",
            userId: user.userId,
            username: user.username,
        }
    }

    /* TESTNA - IZBRISAT KASNIJE */ 
    async getUsers() {
        return await this.prisma.user.findMany();
    }
}
