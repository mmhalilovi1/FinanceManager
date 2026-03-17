import { IsString } from "class-validator";

export class SignInDTO {
    @IsString()
    userId: string;

    @IsString()
    username: string;
}