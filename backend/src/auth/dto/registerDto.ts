import { IsAlphanumeric, IsEmail, IsString, Length } from "class-validator";

export class RegisterDTO {
    @IsString()
    @IsAlphanumeric()
    @Length(4, 12)
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;
}