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
import { CreateIncomeDto, EditIncomeDto } from './dto';
import { IncomeService } from './income.service';

@UseGuards(JwtGuard)
@Controller('incomes')
export class IncomeController {
  constructor(private incomeService: IncomeService) {}

  @Get('')
  getIncomes(@GetUser('id') userId: number) {
    return this.incomeService.getIncomes(userId);
  }

  @Get(':id')
  getIncomeById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) expenseId: number,
  ) {
    return this.incomeService.getIncomeById(userId, expenseId);
  }

  @Post('')
  createIncome(@GetUser('id') userId: number, @Body() dto: CreateIncomeDto) {
    return this.incomeService.createIncome(userId, dto);
  }

  @Patch(':id')
  editIncomeById(
    @GetUser('id') userId: number,
    @Body() dto: EditIncomeDto,
    @Param('id', ParseIntPipe) expenseId: number,
  ) {
    return this.incomeService.editIncomeById();
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteIncomeById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) categoryId: number,
  ) {
    return this.incomeService.deleteIncomeById();
  }
}
