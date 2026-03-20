import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExpenseDTO } from './dto/createExpenseDto';
import { UpdateExpenseDTO } from './dto/updateExpenseDto';

@Injectable()
export class ExpenseService {

    constructor(private prisma: PrismaService) {}

    async createExpense(userId: string, createDto: CreateExpenseDTO) {
        return this.prisma.expense.create({
            data: {
                title: createDto.title,
                description: createDto.description,
                amount: createDto.amount,
                date: createDto.date,
                type: createDto.type,   
            
                user: {
                    connect: { id: userId },
                },

                category: {
                    connect: { id: createDto.category_id },
                },
            },
            select: {
                title: true,
                description: true,
                amount: true,
                date: true,
                type: true,
            },
        });
    }

    async getAllExpenses(userId: string) {
        return this.prisma.expense.findMany({
            where: { userId },
            select: {
                title: true,
                description: true,
                amount: true,
                date: true,
                type: true,
            },
        });
    }

    async getSingleExpense(userId: string, expenseId: string) {
        return this.prisma.expense.findFirst({
            where: {
                id: expenseId,
                userId,
            },
            select: {
                title: true,
                description: true,
                amount: true,
                date: true,
                type: true,
            },
        });
    }
    
    async updateExpense(
        userId: string, 
        expenseId: string,
        updateExpense: UpdateExpenseDTO
    ) {
        return this.prisma.expense.update({
            where: {
                id: expenseId,
                userId: userId,
            },
            data: {
                title: updateExpense.title,
                description: updateExpense.description,
                amount: updateExpense.amount,
                date: updateExpense.date,
                type: updateExpense.type,
                categoryId: updateExpense.category_id,
            },
            select: {
                title: true,
                description: true,
                amount: true,
                date: true,
                type: true,
            },
        });
    }

    async deleteExpense(userId: string, expenseId: string) {
        return this.prisma.expense.delete({
            where: {
                id: expenseId,
                userId: userId,
            },
            select: {
                title: true,
                description: true,
                amount: true,
                date: true,
                type: true,
            },
        });
    }
}
