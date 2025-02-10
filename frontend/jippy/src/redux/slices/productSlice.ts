// redux/slices/productSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ProductState, ProductFormData, Product } from "@/features/product/types";
import axios from "axios";

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

export const createProduct = createAsyncThunk(
  "product/create",
  async (productData: ProductFormData) => {
    const response = await axios.post<Product>("/api/products", productData);
    return response.data;
  }
);

export const fetchProducts = createAsyncThunk(
  "product/fetchAll",
  async (storeId: number) => {
    const response = await axios.get<Product[]>(`/api/stores/${storeId}/products`);
    return response.data;
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
        state.error = action.error.message || "상품 등록에 실패했습니다.";
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
        state.error = action.error.message || "상품 목록을 불러오는데 실패했습니다.";
      });
  },
});

export const { clearError } = productSlice.actions;
export default productSlice.reducer;