import type { CategoryType } from "./CategoryType";

export interface ProductType {
  stock: number;
  name: string;
  description: string;
  category: CategoryType[];
  price: number;
  image: FileList | string;
}
