import { IsOptional, IsString, Length, MaxLength, IsNumber, IsPositive,
    IsDate, IsEnum
 } from "class-validator";
 
import { ExpenseType } from "@prisma/client";
import { Type } from 'class-transformer';

export class UpdateExpenseDTO {
    @IsOptional()
    @IsString()
    @Length(4, 20)
    title?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    description?: string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    amount?: number;
    
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    date?: Date;
    
    @IsOptional()
    @IsEnum(ExpenseType)
    type?: ExpenseType;
    
    @IsOptional()
    @IsString()
    category_id?: string;
}