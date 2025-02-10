import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Recipe, ApiResponse } from '@/features/product/types/index';

interface RecipeState {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
  currentRecipe: Recipe | null;
}

const initialState: RecipeState = {
  recipes: [],
  loading: false,
  error: null,
  currentRecipe: null,
};

export const createRecipe = createAsyncThunk(
  'recipe/create',
  async (recipe: Recipe) => {
    const response = await fetch('/api/recipe/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipe),
    });
    const data: ApiResponse<Recipe> = await response.json();
    if (!data.success) {
      throw new Error(data.code.toString());
    }
    return data.data;
  }
);

export const recipeSlice = createSlice({
  name: 'recipe',
  initialState,
  reducers: {
    setCurrentRecipe: (state, action: PayloadAction<Recipe | null>) => {
      state.currentRecipe = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRecipe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRecipe.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes.push(action.payload);
        state.currentRecipe = action.payload;
      })
      .addCase(createRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Unknown error occurred';
      });
  },
});

export const { setCurrentRecipe, clearError } = recipeSlice.actions;
export default recipeSlice.reducer;