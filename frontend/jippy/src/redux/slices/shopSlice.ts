import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";

export interface Shop {
  id: number;
  userOwnerId: number;
  name: string;
  address: string;
  openingDate: string;
  totalCash: number;
  businessRegistrationNumber: string;
}

interface ShopState {
  shops: Shop[];
  currentShop: Shop | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ShopState = {
  shops: [],
  currentShop: null,
  isLoading: false,
  error: null,
};

export const createShop = createAsyncThunk(
  "shop/createShop",
  async (shopData: Omit<Shop, "id" | "totalCash">, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const accessToken = state.user.accessToken;

      if (!accessToken) {
        throw new Error("인증 토큰이 없습니다.");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/store/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
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
    } catch (error) {
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
      const accessToken = state.user.accessToken;

      if (!accessToken) {
        throw new Error("인증 토큰이 없습니다.");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/store/select`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error("매장 정보 조회 실패");
      }

      const jsonResponse = await response.json();
      
      if (!jsonResponse.success) {
        throw new Error("매장 정보 조회에 실패했습니다.");
      }

      const userShops = jsonResponse.data.filter((shop: Shop) => 
        shop.userOwnerId === userId
      );

      return userShops;
    } catch (error: unknown) {
      console.error("매장 정보 조회 중 오류 발생:", error);
      return rejectWithValue("매장 정보를 불러오지 못했습니다.");
    }
  }
);

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    // 명시적으로 setShops 리듀서 추가
    setShops: (state, action: PayloadAction<Shop[]>) => {
      state.shops = action.payload;
      // 첫 번째 매장을 현재 매장으로 자동 설정
      state.currentShop = action.payload.length > 0 ? action.payload[0] : null;
    },
    setCurrentShop: (state, action: PayloadAction<Shop>) => {
      state.currentShop = action.payload;
    },
    clearShopState: (state) => {
      state.shops = [];
      state.currentShop = null;
      state.isLoading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createShop.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createShop.fulfilled, (state, action: PayloadAction<Shop>) => {
        state.isLoading = false;
        state.currentShop = action.payload;
        state.shops.push(action.payload);
      })
      .addCase(createShop.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchShop.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchShop.fulfilled, (state, action: PayloadAction<Shop[]>) => {
        state.isLoading = false;
        state.shops = action.payload;
        state.currentShop = action.payload[0] || null;
      })
      .addCase(fetchShop.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// 액션 크리에이터들을 명시적으로 내보내기
export const { 
  setShops, 
  setCurrentShop, 
  clearShopState 
} = shopSlice.actions;

export default shopSlice.reducer;