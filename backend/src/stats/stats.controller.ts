import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { GetUser } from 'src/user/user.decorator';

@Controller('stats')
export class StatsController {

    constructor(private statsService: StatsService) {}

    @Get('monthly')
    @UseGuards(AuthGuard)
    getMonthlyStats(@GetUser() user) {
        return this.statsService.getMonthlyStats(user.userId);
    }
}
