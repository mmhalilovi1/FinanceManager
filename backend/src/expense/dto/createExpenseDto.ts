import { IsDate, IsEnum, IsNumber, IsOptional, IsPositive, IsString, Length, MaxLength } from "class-validator";
import { ExpenseType } from "@prisma/client";
import { Type } from 'class-transformer';

export class CreateExpenseDTO {
    @IsString()
    @Length(4, 20)
    title: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    description?: string;

    @IsNumber()
    @IsPositive()
    amount: number;

    @Type(() => Date)
    @IsDate()
    date: Date;

    @IsEnum(ExpenseType)
    type: ExpenseType;

    @IsString()
    category_id: string;
}