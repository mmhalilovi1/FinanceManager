import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBudgetDTO } from './dto/createBudgetDto';
import { UpdateBudgetDTO } from './dto/updateBudgetDto';

@Injectable()
export class BudgetService {

    constructor(private prisma: PrismaService) {}

    async getBudgets(userId: string) {
        return this.prisma.budget.findMany({
            where: { userId },
            select: {
                limit_amount: true,
                month: true,
                year: true,
            },
        });
    }

    async createBudget(userId: string, createBudgetDto: CreateBudgetDTO) {
        return this.prisma.budget.create({
            data: {
                limit_amount: createBudgetDto.limit_amount,
                month: createBudgetDto.month,
                year: createBudgetDto.year,
            
                user: {
                    connect: { id: userId }
                }
            },
            select: {
                limit_amount: true,
                month: true,
                year: true,
            },
        });
    }

    async updateBudget(
        userId: string, 
        budgetId: string,
        updateBudgetDto: UpdateBudgetDTO
    ) {
        try {
            return await this.prisma.budget.update({
                where: {
                    id: budgetId,
                    userId: userId,
                },
                data: {
                    limit_amount: updateBudgetDto.limit_amount,
                    month: updateBudgetDto.month,
                    year: updateBudgetDto.year,
                },
                select: {
                    limit_amount: true,
                    month: true,
                    year: true,
                },
            });
        } catch (error) {
            throw new NotFoundException("Budget doesn't exist");
        }
    }

    async deleteBudget(userId: string, budgetId: string) {
        try {
            return await this.prisma.budget.delete({
                where: {
                    id: budgetId,
                    userId: userId,
                },
                select: {
                    limit_amount: true,
                    month: true,
                    year: true,
                },
            });
        } catch (error) {
            throw new NotFoundException("Budget doesn't exist");
        }
    }
}
