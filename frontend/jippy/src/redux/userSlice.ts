import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// UserState 타입 정의
export interface UserState {
  id: number | null;
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
  name: 'user',
  initialState,
  reducers: {
    setUserToken: (state, action: PayloadAction<{ accessToken: string }>) => {
      state.accessToken = action.payload.accessToken;
    },
    clearUserToken: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
    },
    setUserInfo: (state, action: PayloadAction<UserState>) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.age = action.payload.age;
      state.userType = action.payload.userType;
    },
  },
});

export const { setUserToken, clearUserToken, setUserInfo } = userSlice.actions;

export default userSlice.reducer;
