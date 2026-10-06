import { Category } from '@/domain/entities/category.entity';

export interface ListCategoriesResponse {
  success: boolean;
  data: Category[];
}
