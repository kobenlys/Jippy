import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ProductDetailResponse } from "@/features/product/types";
import axios from "axios";

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

// productSlice.ts
export const createProduct = createAsyncThunk(
  'product/create',
  async ({ formData, storeId }: { formData: FormData; storeId: number }, { rejectWithValue }) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      
      // FormData에서 데이터 추출
      const dataStr = formData.get('data') as string;
      const productData = JSON.parse(dataStr);
      
      // 데이터를 그대로 사용 (변환하지 않음)
      const requestData = {
        productCategoryId: productData.productCategoryId,
        storeId: productData.storeId,
        name: productData.name,
        price: productData.price,
        status: productData.status,
        image: "temp_image",
        productType: productData.productType,  // 문자열 그대로 사용
        productSize: productData.productSize   // 문자열 그대로 사용
      };

      console.log('=== 최종 전송 데이터 ===');
      console.log(JSON.stringify(requestData, null, 2));
      
      const response = await axios.post(
        `${API_URL}/api/product/${storeId}/create`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('API 에러 상세:', error.response?.data);
        const errorMessage = error.response?.data?.errors?.[0]?.reason || 
                         error.response?.data?.message || 
                         '상품 등록에 실패했습니다.';
        return rejectWithValue(errorMessage);
      }
      return rejectWithValue('알 수 없는 오류가 발생했습니다.');
    }
  }
);

export const fetchProducts = createAsyncThunk(
  "product/fetchAll",
  async (storeId: number, { rejectWithValue }) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await axios.get<ProductDetailResponse[]>(
        `${API_URL}/api/product/${storeId}/select`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || '상품 목록을 불러오는데 실패했습니다.');
      }
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
        if (action.payload.data) {  // data 객체 확인
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
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = productSlice.actions;
export default productSlice.reducer;