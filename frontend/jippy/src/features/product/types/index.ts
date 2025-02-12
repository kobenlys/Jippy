export enum ProductSize {
  S = 1,
  M = 2,
  L = 3,
  F = 4
}

export enum ProductType {
  ICE = 1,
  HOT = 2,
  EXTRA = 3
}

// Recipe 인터페이스 추가
export interface Recipe {
  id: number;
  productId: number;
  storeId: number;
  name: string;
  description?: string;
  quantity: number;
  unit: string;
}

// ApiResponse 인터페이스도 필요해 보입니다
export interface ApiResponse<T> {
  data: T;
  message?: string;
  code: number;   
  success: boolean;
}

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

// 문자열을 Enum 값으로 변환하는 유틸리티 함수
export const getProductSizeValue = (size: 'S' | 'M' | 'L' | 'F'): number => {
  return ProductSize[size];
};

export const getProductTypeValue = (type: 'ICE' | 'HOT' | 'EXTRA'): number => {
  return ProductType[type];
};