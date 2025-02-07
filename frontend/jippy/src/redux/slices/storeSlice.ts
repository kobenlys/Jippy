import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";

interface Store {
  id: number;
  userOwnerId: number;
  name: string;
  address: string;
  openingDate: string;
  totalCash: number;
  businessRegistrationNumber: string;
}

interface StoreState {
  stores: Store[];
  currentStore: Store | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: StoreState = {
  stores: [],
  currentStore: null,
  isLoading: false,
  error: null,
};

export const createStore = createAsyncThunk(
  "store/createStore",
  async (storeData: Omit<Store, "id" | "totalCash">, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/store/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...storeData,
          totalCash: 0,
        }),
      });

      if (!response.ok) {
        throw new Error("매장 등록 실패");
      }

      const data = await response.json();
      return data.data;
    } catch (error: unknown) {
      console.error("매장 등록 중 오류 발생:", error);
      return rejectWithValue("매장 등록에 실패했습니다.");
    }
  }
);

export const fetchStore = createAsyncThunk(
  "store/fetchUserStore",
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/store/select`);
      if (!response.ok) {
        throw new Error("매장 정보 조회 실패");
      }
      const data = await response.json();
      return data.data.filter((store: Store) => store.userOwnerId === userId);
    } catch (error: unknown) {
      console.error("매장 정보 조회 중 오류 발생:", error);
      return rejectWithValue("매장 정보를 불러오지 못했습니다.");
    }
  }
);

export const updateStore = createAsyncThunk(
  "store/update",
  async ({ storeId, data }: { storeId: number; data: Partial<Store> }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.user.accessToken;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/store/update/${storeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error("매장 정보 수정 실패");
      }

      return await response.json();
    } catch (error: unknown) {
      console.error("매장 정보 수정 중 오류 발생:", error);
      return rejectWithValue("매장 정보 수정에 실패했습니다.");
    }
  }
);

const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createStore.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createStore.fulfilled, (state, action: PayloadAction<Store>) => {
        state.isLoading = false;
        state.currentStore = action.payload;
      })
      .addCase(createStore.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchStore.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStore.fulfilled, (state, action: PayloadAction<Store[]>) => {
        state.isLoading = false;
        state.stores = action.payload;
        state.currentStore = action.payload[0] || null;
      })
      .addCase(fetchStore.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateStore.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateStore.fulfilled, (state, action: PayloadAction<Store>) => {
        state.isLoading = false;
        state.currentStore = action.payload;
      })
      .addCase(updateStore.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default storeSlice.reducer;