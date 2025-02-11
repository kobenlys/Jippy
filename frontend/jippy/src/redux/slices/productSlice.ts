// redux/slices/productSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ProductFormData, ProductDetailResponse } from "@/features/product/types";
import axios from "axios";

interface ProductState {
  products: ProductDetailResponse[];
  loading: false;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

// 이미지 파일을 base64 문자열로 변환하는 유틸리티 함수
const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // base64 데이터에서 앞부분의 "data:image/jpeg;base64," 등을 제거
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      } else {
        reject(new Error('Failed to convert image to base64'));
      }
    };
    reader.onerror = error => reject(error);
  });
};

export const createProduct = createAsyncThunk(
  "product/create",
  async (productData: ProductFormData, { rejectWithValue }) => {
    try {
      let imageString = "";
      if (productData.image instanceof File) {
        imageString = await convertImageToBase64(productData.image);
      }

      const requestData = {
        productCategoryId: productData.productCategoryId,
        storeId: productData.storeId,
        name: productData.name,
        price: productData.price,
        status: productData.status,
        image: imageString,
        productType: productData.productType,
        productSize: productData.productSize
      };

      const response = await axios.post<ProductDetailResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/product/${productData.storeId}/create`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.message || '상품 등록에 실패했습니다.');
      }
      return rejectWithValue('상품 등록에 실패했습니다.');
    }
  }
);

export const fetchProducts = createAsyncThunk(
  "product/fetchAll",
  async (storeId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get<ProductDetailResponse[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/product/${storeId}/select`
      );
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.message || '상품 목록을 불러오는데 실패했습니다.');
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
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "상품 등록에 실패했습니다.";
      })
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "상품 목록을 불러오는데 실패했습니다.";
      });
  },
});

export const { clearError } = productSlice.actions;
export default productSlice.reducer;