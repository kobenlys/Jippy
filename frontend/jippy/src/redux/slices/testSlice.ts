// store/productSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductFormState, ProductType, ProductSize, ProductCategory } from '@/test/types/product';

const initialState: ProductFormState = {
  name: '',
  category: 'COFFEE',
  selectedType: null,
  variants: {}
};

const testSlice = createSlice({
  name: 'test',
  initialState,
  reducers: {
    setBaseInfo: (state, action: PayloadAction<{ name: string; category: ProductCategory }>) => {
      state.name = action.payload.name;
      state.category = action.payload.category;
    },
    setSelectedType: (state, action: PayloadAction<ProductType>) => {
      state.selectedType = action.payload;
    },
    addVariant: (state, action: PayloadAction<{
      type: ProductType;
      size: ProductSize;
      price: number;
      recipeId: number;
      isActive: boolean;
    }>) => {
      const { type, size, price, recipeId, isActive } = action.payload;
      if (!state.variants[type]) {
        state.variants[type] = {};
      }
      state.variants[type]![size] = { price, recipeId, isActive };
    },
    resetForm: () => initialState
  }
});

export const { setBaseInfo, setSelectedType, addVariant, resetForm } = testSlice.actions;
export default testSlice.reducer;