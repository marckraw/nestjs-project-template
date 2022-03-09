import { IsNumber, IsOptional, IsString } from 'class-validator';

export class EditIncomeDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  categoryId: number;
}
