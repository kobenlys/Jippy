export type ProductSize = "S" | "M" | "L";
export type ProductType = "HOT" | "ICE";

export interface ProductFormData {
  name: string;
  price: number;
  productSize: ProductSize;
  productType: ProductType;
  status: boolean;
  storeId: number;
  productCategoryId: number;
  image?: File | null;
}

export interface ProductDetailResponse {
  id: number;
  productCategoryId: number;
  storeId: number;
  name: string;
  price: number;
  status: boolean;
  image: string;
  productType: ProductType;
  productSize: ProductSize;
}