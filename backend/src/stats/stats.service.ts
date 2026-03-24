import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StatsService {

    constructor(private prisma: PrismaService) {}

    async getMonthlyStats(userId: string) {
        const expenses = await this.prisma.expense.findMany({
            where: {
                userId,
            },
            select: {
                amount: true,
                date: true,
                category: {
                    select: {
                        name: true,
                        tag: true,
                    },
                },
            },
        });

        const monthlyStats = {};

        expenses.forEach((expense) => {
            const month = new Date(expense.date).toLocaleString('en-US', {
                month: "long",
            });

            if(!monthlyStats[month]) {
                monthlyStats[month] = {
                    month,
                    amount: 0,
                    categories: new Set(),
                };
            }

            monthlyStats[month].amount += expense.amount;
            monthlyStats[month].categories.add(expense.category);
        });

        return Object.values(monthlyStats).map((stat: any) => ({
            month: stat.month,
            amount: stat.amount,
            categories: Array.from(stat.categories).map((cat) => ({
                category: cat,
            })),
        }));
    }
}
