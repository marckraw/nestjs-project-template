import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncomeDto, EditIncomeDto } from './dto';

@Injectable()
export class IncomeService {
  constructor(private prisma: PrismaService) {}

  getIncomes(userId: number) {
    console.log('getting incomes...');
  }

  getIncomeById(userId: number, categoryId: number) {
    console.log('getting incomes by id...');
  }

  createIncome(userId: number, dto: CreateIncomeDto) {
    console.log('creating income...');
  }

  async editIncomeById() {
    console.log('editing...');
  }

  async deleteIncomeById() {
    console.log('deleting...');
  }
}
