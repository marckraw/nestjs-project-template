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
import { CreateCategoryDto, EditCategoryDto } from './dto';
import { CategoryService } from './category.service';
import { CreateBookmarkDto, EditBookmarkDto } from '../bookmark/dto';

@UseGuards(JwtGuard)
@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  getCategories(@GetUser('id') userId: number) {
    return this.categoryService.getCategories(userId);
  }

  @Get(':id')
  getCategoryById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) categoryId: number,
  ) {
    return this.categoryService.getCategoryById(userId, categoryId);
  }

  @Post()
  createCategory(
    @GetUser('id') userId: number,
    @Body() dto: CreateCategoryDto,
  ) {
    return this.categoryService.createCategory(userId, dto);
  }

  @Patch(':id')
  editCategoryById(
    @GetUser('id') userId: number,
    @Body() dto: EditCategoryDto,
    @Param('id', ParseIntPipe) categoryId: number,
  ) {
    return this.categoryService.editCategoryById(userId, categoryId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteCategoryById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) categoryId: number,
  ) {
    return this.categoryService.deleteCategoryById(userId, categoryId);
  }
}
