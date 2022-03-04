import { IsString } from 'class-validator';

export class EditCategoryDto {
  @IsString()
  title: string;
}
