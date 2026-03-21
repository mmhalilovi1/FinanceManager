import { Controller, UseGuards, Get, Post, Patch, Param, Body, Delete } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { GetUser } from 'src/user/user.decorator';
import { CreateBudgetDTO } from './dto/createBudgetDto';
import { UpdateBudgetDTO } from './dto/updateBudgetDto';

@Controller('budget')
export class BudgetController {

    constructor(private budgetService: BudgetService) {}

    // GET /budget
    @Get()
    @UseGuards(AuthGuard)
    getBudgets(@GetUser() user) {
        return this.budgetService.getBudgets(user.userId);
    }

    // POST /budget
    @Post()
    @UseGuards(AuthGuard)
    createBudget(@GetUser() user, @Body() createBudgetDto: CreateBudgetDTO) {
        return this.budgetService.createBudget(user.userId, createBudgetDto);
    }

    // PATCH /budget/:id
    @Patch(':id')
    @UseGuards(AuthGuard)
    updateBudget(
        @GetUser() user,
        @Param('id') id: string,
        @Body() updateBudgetDto: UpdateBudgetDTO
    ) {
        return this.budgetService.updateBudget(user.userId, id, updateBudgetDto);
    }

    // DELETE /budget/:id
    @Delete(':id')
    @UseGuards(AuthGuard)
    deleteBudget(@GetUser() user, @Param('id') id: string) {
        return this.budgetService.deleteBudget(user.userId, id);
    }
}
