// types/product.ts

export type ProductSize = 'S' | 'M' | 'L' | 'F';
export type ProductType = 'HOT' | 'ICE' | 'EXTRA';
export type ProductCategory = 'COFFEE' | 'NON_COFFEE' | 'TEA' | 'ADE' | 'SMOOTHIE';

export interface ProductBase {
  name: string;
  category: ProductCategory;
}

export interface ProductVariant extends ProductBase {
  type: ProductType;
  size: ProductSize;
  price: number;
  isActive: boolean;
  recipeId: number; // 레시피 DB의 ID를 참조
}

export interface ProductFormState extends ProductBase {
  selectedType: ProductType | null;
  variants: {
    [K in ProductType]?: {
      [S in ProductSize]?: {
        price: number;
        recipeId: number;
        isActive: boolean;
      }
    }
  };
}