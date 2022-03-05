import { IsNumber, IsOptional, IsString } from 'class-validator';

export class EditExpenseDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  categoryId: number;
}
