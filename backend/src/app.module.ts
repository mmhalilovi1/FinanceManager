import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ExpenseModule } from './expense/expense.module';
import { CategoryModule } from './category/category.module';
import { BudgetModule } from './budget/budget.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    AuthModule, 
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ExpenseModule,
    CategoryModule,
    BudgetModule,
    StatsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
