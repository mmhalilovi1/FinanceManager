import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDTO } from './dto/loginDto';
import { JwtService } from '@nestjs/jwt';
import { SignInDTO } from './dto/signInDto';
import { RegisterDTO } from './dto/registerDto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {

    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) {}

    async register(registerDto: RegisterDTO) {
        const { name, email, password } = registerDto;

        const hash_pw = await argon2.hash(password);
    
        try {
            return await this.prisma.user.create({
                data: {
                    email,
                    name,
                    password_hash: hash_pw
                },
                select: {
                    email: true,
                    name: true,
                }
            });
        } catch (error) {
            if(error.code === 'P2002') throw new ConflictException("Email or username already taken");
            throw error;
        }
    }

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

        return this.signIn(user)
    }

    async signIn(user: SignInDTO) {
        /* The token payload is the second part of a JSON Web Token (JWT) that contains claims, 
        which are statements or pieces of information about an entity (typically a user) and additional data. */
        const tokenPayLoad = {
            sub: user.userId,   // subject
            username: user.username
        }; 

        /* Generating access token by signing the token payload */ 
        const accessToken = await this.jwtService.signAsync(tokenPayLoad);

        return {
            accessToken,
            userId: user.userId,
            username: user.username
        };
    }
}
