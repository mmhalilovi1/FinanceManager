import { Controller, Post, UseGuards, Body, Get, Param } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { GetUser } from 'src/user/user.decorator';
import { CreateExpenseDTO } from './dto/createExpenseDto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('expense')
export class ExpenseController {

    constructor(private expenseService: ExpenseService) {}

    // POST /expense
    @Post()
    @UseGuards(AuthGuard)
    createExpense(
        @GetUser() user, 
        @Body() createDto: CreateExpenseDTO
    ) {
        return this.expenseService.createExpense(user.userId, createDto);
    }

    // GET /expense
    @Get()
    @UseGuards(AuthGuard)
    getAllExpenses(@GetUser() user) {
        return this.expenseService.getAllExpenses(user.userId);
    }

    // GET /expense/:id
    @Get(':id')
    @UseGuards(AuthGuard)
    getSingleExpense(@GetUser() user, @Param('id') id: string) {
        return this.expenseService.getSingleExpense(user.userId, id);
    }
}
