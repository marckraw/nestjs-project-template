import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto, EditExpenseDto } from './dto';

@Injectable()
export class ExpenseService {
  constructor(private prisma: PrismaService) {}

  getExpenses(userId: number) {
    return this.prisma.expense.findMany({
      where: {
        userId,
      },
    });
  }

  getExpenseById(userId: number, categoryId: number) {
    return this.prisma.expense.findFirst({
      where: {
        userId,
        id: categoryId,
      },
    });
  }

  createExpense(userId: number, dto: CreateExpenseDto) {
    return this.prisma.expense.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  async editExpenseById() {
    console.log('editing...');
  }

  async deleteExpenseById() {
    console.log('deleting...');
  }
}
