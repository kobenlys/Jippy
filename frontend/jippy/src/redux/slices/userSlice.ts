import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: string | null;
  email: string | null;
  name: string | null;
  age: string | null;
  userType: string | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: UserState = {
  id: null,
  email: null,
  name: null,
  age: null,
  userType: null,
  accessToken: null,
  refreshToken: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserToken: (
      state,
      action: PayloadAction<{
        accessToken: string | null;
        refreshToken: string | null;
      }>
    ) => {
      // state의 형태를 명시적으로 지정하고 깊은 복사를 사용
      return {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    },
    setUserInfo: (state, action: PayloadAction<Partial<UserState>>) => {
      // setUserInfo는 전체 상태를 업데이트하므로 기존 상태 유지
      return { ...state, ...action.payload };
    },
    logout: (state) => {
      return initialState;
    },
  },
});

export const { setUserInfo, setUserToken, logout } = userSlice.actions;
export default userSlice.reducer;