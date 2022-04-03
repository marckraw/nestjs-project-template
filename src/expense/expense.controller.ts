import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { CreateExpenseDto, EditExpenseDto } from './dto';
import { ExpenseService } from './expense.service';

@UseGuards(JwtGuard)
@Controller('expenses')
export class ExpenseController {
  constructor(private expenseService: ExpenseService) {}

  @Get('')
  getExpenses(@GetUser('id') userId: number) {
    return this.expenseService.getExpenses(userId);
  }

  @Get(':id')
  getExpenseById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) expenseId: number,
  ) {
    return this.expenseService.getExpenseById(userId, expenseId);
  }

  @Post('')
  createExpense(@GetUser('id') userId: number, @Body() dto: CreateExpenseDto) {
    return this.expenseService.createExpense(userId, dto);
  }

  @Patch(':id')
  editExpenseById(
    @GetUser('id') userId: number,
    @Body() dto: EditExpenseDto,
    @Param('id', ParseIntPipe) expenseId: number,
  ) {
    return this.expenseService.editExpenseById();
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteExpenseById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) categoryId: number,
  ) {
    return this.expenseService.deleteExpenseById();
  }
}
