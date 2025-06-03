export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  isActive: boolean;
  image?: string | File;
}

export interface ProductFormData {
  id: string | number;
  name: string;
  price: string | number;
  description: string;
  category: string;
  stock: string | number;
  isActive: boolean;
  image?: string | File;
}