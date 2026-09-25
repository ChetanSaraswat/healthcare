export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  parentId?: string | null;
  children?: Category[];
  productCount?: number;
  displayOrder?: number;
  isActive?: boolean;
}
