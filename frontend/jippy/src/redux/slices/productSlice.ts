// productSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ProductDetailResponse } from "@/features/product/types";

interface ProductState {
  products: ProductDetailResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

export const createProduct = createAsyncThunk(
  'product/createProduct',
  async ({ storeId, productData }: { storeId: number, productData: any }, { rejectWithValue }) => {
    try {
      const requestData = {
        createProduct: {
          productCategoryId: productData.createProduct.productCategoryId,
          storeId: productData.createProduct.storeId,
          name: productData.createProduct.name,
          price: productData.createProduct.price,
          status: productData.createProduct.status,
          productType: productData.createProduct.productType,
          productSize: productData.createProduct.productSize
        },
        image: productData.image
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/product/${storeId}/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || '상품 등록에 실패했습니다.');
      }

      return data;
    } catch (error) {
      return rejectWithValue('상품 등록 중 오류가 발생했습니다.');
    }
  }
);

export const fetchProducts = createAsyncThunk(
  "product/fetchAll",
  async (storeId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/product/${storeId}/select`
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || '상품 목록을 불러오는데 실패했습니다.');
      }

      return data.data || [];
    } catch (error) {
      return rejectWithValue('상품 목록을 불러오는데 실패했습니다.');
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          state.products.push(action.payload.data);
        }
        state.error = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : '오류가 발생했습니다.';
      });
  },
});

export const { clearError } = productSlice.actions;
export default productSlice.reducer;