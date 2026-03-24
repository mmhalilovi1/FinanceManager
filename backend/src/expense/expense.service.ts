import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExpenseDTO } from './dto/createExpenseDto';
import { UpdateExpenseDTO } from './dto/updateExpenseDto';
import { GetExpensesDTO } from './dto/getExpensesDto';
import { Prisma } from '@prisma/client';

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

    async getAllExpenses(userId: string, query: GetExpensesDTO) {
        const {
            sort,
            order = 'asc',
            from,
            to,
            page = 1,
            limit = 10,
        } = query;

        const where: any = { userId };

        if (from || to) {
            where.date = {};
            if (from) where.date.gte = new Date(from);
            if (to) where.date.lte = new Date(to);
        }

        let orderBy: Prisma.ExpenseOrderByWithRelationInput;

        if (sort) {
            orderBy = {
                [sort]: order ?? 'asc',
            };
        } else {
            orderBy = {
                date: 'desc',
            };
        }

        const skip = (page - 1) * limit;
         
        return this.prisma.expense.findMany({
            where,
            orderBy,
            skip,
            take: limit,
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
        const expense =  await this.prisma.expense.findFirst({
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

        if(!expense) throw new NotFoundException("Expense doesn't exist");

        return expense;
    }
    
    async updateExpense(
        userId: string, 
        expenseId: string,
        updateExpense: UpdateExpenseDTO
    ) {
        try {
            return await this.prisma.expense.update({
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
        } catch (error) {
            throw new NotFoundException("Expense doesn't exist");
        }
    }

    async deleteExpense(userId: string, expenseId: string) {
        try {
            return await this.prisma.expense.delete({
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
        } catch (error) {
            throw new NotFoundException("Expense doesn't exist");
        }
    }
}
