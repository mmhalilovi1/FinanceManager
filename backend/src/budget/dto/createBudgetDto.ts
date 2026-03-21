import { IsNumber, IsPositive, Min, Max } from "class-validator";

export class CreateBudgetDTO {
    @IsNumber()
    @IsPositive()
    limit_amount: number;

    @IsNumber()
    @Min(1)
    @Max(12)
    month: number;

    @IsNumber()
    @Min(2026)
    year: number;
}