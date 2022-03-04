import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, EditCategoryDto } from './dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  getCategories(userId: number) {
    return this.prisma.category.findMany({
      where: {
        userId,
      },
    });
  }

  getCategoryById(userId: number, categoryId: number) {
    return this.prisma.category.findFirst({
      where: {
        userId,
        id: categoryId,
      },
    });
  }

  createCategory(userId: number, dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  async editCategoryById(
    userId: number,
    categoryId: number,
    dto: EditCategoryDto,
  ) {
    const category = await this.prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category || category.userId !== userId) {
      throw new ForbiddenException('Access to resource denied.');
    }

    return this.prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteCategoryById(userId: number, categoryId: number) {
    const category = await this.prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category || category.userId !== userId) {
      throw new ForbiddenException('Access to resource denied.');
    }

    return this.prisma.category.delete({
      where: {
        id: categoryId,
      },
    });
  }
}
