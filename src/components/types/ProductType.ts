

export interface ProductType {
    _id?: string;
  stock: number;
  name: string;
  description: string;
category?: { name: string } | null

  price: number;
  image: FileList | string;
  size:string

}
// export type Size = "S" | "M" | "XL" | "XXL" | "XXXL";
