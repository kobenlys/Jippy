// store/slices/categorySlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Category {
  id: number;
  categoryName: string;
  description?: string;
}

interface CategoryState {
  categories: Category[];
  selectedCategory: Category | null;
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  selectedCategory: null,
  loading: false,
  error: null,
};

interface CategoryResponse {
  code: number;
  success: boolean;
  data: Category[];
}

// API 요청을 안전하게 처리하는 함수
const fetchData = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};


// 전체 카테고리 조회
export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async (shopId: number) => fetchData(`${process.env.NEXT_PUBLIC_API_URL}/api/category/${shopId}/select`)
);

// 카테고리 생성
export const createCategory = createAsyncThunk(
  'category/createCategory',
  async ({ shopId, data }: { shopId: number; data: Omit<Category, 'id'> }) =>
    fetchData(`${process.env.NEXT_PUBLIC_API_URL}/api/category/${shopId}/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
);

// 카테고리 수정
export const updateCategory = createAsyncThunk(
  'category/updateCategory',
  async ({ shopId, categoryId, data }: { shopId: number; categoryId: number; data: Partial<Category> }) =>
    fetchData(`${process.env.NEXT_PUBLIC_API_URL}/api/category/${shopId}/update/${categoryId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
);

// 카테고리 삭제
export const deleteCategory = createAsyncThunk(
  'category/deleteCategory',
  async ({ shopId, categoryId }: { shopId: number; categoryId: number }) => {
    await fetchData(`${process.env.NEXT_PUBLIC_API_URL}/api/category/${shopId}/delete/${categoryId}`, {
      method: 'DELETE',
    });
    return categoryId;
  }
);

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 전체 조회
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<CategoryResponse>) => {
        state.loading = false;
        state.categories = action.payload;  // API 응답 전체를 저장
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      })

      // 생성
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories = [...state.categories, action.payload];
      })

      // 수정
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.categories = state.categories.map((cat) =>
          cat.id === action.payload.id ? action.payload : cat
        );
        if (state.selectedCategory?.id === action.payload.id) {
          state.selectedCategory = action.payload;
        }
      })

      // 삭제
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((cat) => cat.id !== action.payload);
        if (state.selectedCategory?.id === action.payload) {
          state.selectedCategory = null;
        }
      });
  },
});

export const { clearSelectedCategory } = categorySlice.actions;
export default categorySlice.reducer;
