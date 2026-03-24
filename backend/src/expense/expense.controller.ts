import { Controller, Post, UseGuards, Body, Get, Param, Patch, Delete, Query } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { GetUser } from 'src/user/user.decorator';
import { CreateExpenseDTO } from './dto/createExpenseDto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UpdateExpenseDTO } from './dto/updateExpenseDto';
import { GetExpensesDTO } from './dto/getExpensesDto';

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
    getAllExpenses(
        @GetUser() user,
        @Query() query: GetExpensesDTO
    ) {
        return this.expenseService.getAllExpenses(user.userId, query);
    }

    // GET /expense/:id
    @Get(':id')
    @UseGuards(AuthGuard)
    getSingleExpense(@GetUser() user, @Param('id') id: string) {
        return this.expenseService.getSingleExpense(user.userId, id);
    }

    // PATCH /expense/:id
    @Patch(':id')
    @UseGuards(AuthGuard)
    updateExpense(
        @GetUser() user,
        @Param('id') id: string,
        @Body() updateDto: UpdateExpenseDTO
    ) {
        return this.expenseService.updateExpense(user.userId, id, updateDto);
    }

    // DELETE /expense/:id
    @Delete(':id')
    @UseGuards(AuthGuard)
    deleteExpense(
        @GetUser() user, 
        @Param('id') id: string
    ) {
        return this.expenseService.deleteExpense(user.userId, id);
    }
}
