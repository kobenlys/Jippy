// types/product.ts
export enum ProductType {
    ICE = 1,
    HOT = 2,
    EXTRA = 3
  }
  
  export enum ProductSize {
    S = 1,
    M = 2,
    L = 3,
    F = 4
  }
  
  export const ProductTypeLabel: Record<ProductType, string> = {
    [ProductType.ICE]: 'ICE',
    [ProductType.HOT]: 'HOT',
    [ProductType.EXTRA]: 'EXTRA'
  };
  
  export const ProductSizeLabel: Record<ProductSize, string> = {
    [ProductSize.S]: 'S',
    [ProductSize.M]: 'M',
    [ProductSize.L]: 'L',
    [ProductSize.F]: 'F'
  };
  
  export const AVAILABLE_SIZES = {
    [ProductType.HOT]: [ProductSize.S, ProductSize.M, ProductSize.L],
    [ProductType.ICE]: [ProductSize.S, ProductSize.M, ProductSize.L],
    [ProductType.EXTRA]: [ProductSize.F]
  } as const;
  
  export interface ProductFormData {
    name: string;
    categoryId: number;
    image?: string;
    type: ProductType;
    isAvailable: boolean;
  }
  
  export interface SizeRecipeData {
    price: number;
    recipe: {
      name: string;
      amount: number;
      unit: string;
    }[];
  }
  
  export interface ProductRegistrationData extends ProductFormData {
    sizes: Partial<Record<ProductSize, SizeRecipeData>>;
  }