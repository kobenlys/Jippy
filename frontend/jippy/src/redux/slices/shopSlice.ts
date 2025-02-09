import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";

interface Shop {
  id: number;
  userOwnerId: number;
  name: string;
  address: string;
  openingDate: string;
  totalCash: number;
  businessRegistrationNumber: string;
}

interface ShopState {
  shop: {
    shops: Shop[];
    currentShop: Shop | null;
    isLoading: boolean;
    error: string | null;
  }
}

const initialState: ShopState = {
  shop: {
    shops: [],
    currentShop: null,
    isLoading: false,
    error: null,
  }
};

export const createShop = createAsyncThunk(
  "shop/createShop",
  async (shopData: Omit<Shop, "id" | "totalCash">, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.user.auth.accessToken;  // 수정된 경로

      if (!token) {
        throw new Error("인증 토큰이 없습니다.");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/store/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...shopData,
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

export const fetchShop = createAsyncThunk(
  "shop/fetchUserShop",
  async (userId: number, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.user.auth.accessToken;

      if (!token) {
        throw new Error("인증 토큰이 없습니다.");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/store/select`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error("매장 정보 조회 실패");
      }

      const jsonResponse = await response.json();
      const filteredShops = jsonResponse.data.filter((shop: Shop) => 
        shop.userOwnerId === userId
      );

      return filteredShops;
    } catch (error: unknown) {
      console.error("매장 정보 조회 중 오류 발생:", error);
      return rejectWithValue("매장 정보를 불러오지 못했습니다.");
    }
  }
);

export const updateShop = createAsyncThunk(
  "shop/update",
  async ({ storeId, data }: { storeId: number; data: Partial<Shop> }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.user.auth.accessToken;  // 수정된 경로

      if (!token) {
        throw new Error("인증 토큰이 없습니다.");
      }

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

      const result = await response.json();
      return result.data;
    } catch (error: unknown) {
      console.error("매장 정보 수정 중 오류 발생:", error);
      return rejectWithValue("매장 정보 수정에 실패했습니다.");
    }
  }
);

export const deleteShop = createAsyncThunk(
  "shop/deleteShop",
  async (storeId: number, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.user.auth.accessToken;  // 수정된 경로

      if (!token) {
        throw new Error("인증 토큰이 없습니다.");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/store/delete/${storeId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      // 서버 응답 본문 로깅 추가
      const responseBody = await response.text();
      console.log('서버 응답:', responseBody);

      if (!response.ok) {
        throw new Error("매장 삭제 실패");
      }

      return storeId;
    } catch (error: unknown) {
      console.error("매장 삭제 중 오류 발생:", error);
      return rejectWithValue("매장 삭제에 실패했습니다.");
    }
  }
);

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createShop.pending, (state) => {
        state.shop.isLoading = true;
        state.shop.error = null;
      })
      .addCase(createShop.fulfilled, (state, action: PayloadAction<Shop>) => {
        state.shop.isLoading = false;
        state.shop.currentShop = action.payload;
        state.shop.shops.push(action.payload);
      })
      .addCase(createShop.rejected, (state, action) => {
        state.shop.isLoading = false;
        state.shop.error = action.payload as string;
      })
      .addCase(fetchShop.pending, (state) => {
        state.shop.isLoading = true;
        state.shop.error = null;
      })
      .addCase(fetchShop.fulfilled, (state, action: PayloadAction<Shop[]>) => {
        state.shop.isLoading = false;
        state.shop.shops = action.payload;
        state.shop.currentShop = action.payload[0] || null;
      })
      .addCase(fetchShop.rejected, (state, action) => {
        state.shop.isLoading = false;
        state.shop.error = action.payload as string;
      })
      .addCase(updateShop.pending, (state) => {
        state.shop.isLoading = true;
        state.shop.error = null;
      })
      .addCase(updateShop.fulfilled, (state, action: PayloadAction<Shop>) => {
        state.shop.isLoading = false;
        state.shop.currentShop = action.payload;
        const index = state.shop.shops.findIndex(shop => shop.id === action.payload.id);
        if (index !== -1) {
          state.shop.shops[index] = action.payload;
        }
      })
      .addCase(updateShop.rejected, (state, action) => {
        state.shop.isLoading = false;
        state.shop.error = action.payload as string;
      })
      .addCase(deleteShop.pending, (state) => {
        state.shop.isLoading = true;
        state.shop.error = null;
      })
      .addCase(deleteShop.fulfilled, (state, action: PayloadAction<number>) => {
        state.shop.isLoading = false;
        state.shop.shops = state.shop.shops.filter(shop => shop.id !== action.payload);
        state.shop.currentShop = state.shop.shops.length > 0 ? state.shop.shops[0] : null;
      })
      .addCase(deleteShop.rejected, (state, action) => {
        state.shop.isLoading = false;
        state.shop.error = action.payload as string;
      });
  },
});

export default shopSlice.reducer;