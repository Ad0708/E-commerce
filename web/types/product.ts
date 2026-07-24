export interface Product {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  brand?: string;
  sku?: string;
  discountPrice?: number;
  featured: boolean;
  status: "active" | "draft" | "out_of_stock";
}

export interface ProductFormValues {
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  images: (File | string)[];
  brand?: string;
  sku?: string;
  discountPrice?: number;
  featured: boolean;
  status: "active" | "draft" | "out_of_stock";
}
