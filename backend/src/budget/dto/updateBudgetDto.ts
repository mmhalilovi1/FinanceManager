import { IsNumber, IsPositive, Min, Max, IsOptional } from "class-validator";

export class UpdateBudgetDTO {
    @IsOptional()
    @IsNumber()
    @IsPositive()
    limit_amount?: number;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(12)
    month?: number;

    @IsOptional()
    @IsNumber()
    @Min(2026)
    year?: number;
}