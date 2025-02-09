import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  user: {
    id: string | null;
    email: string | null;
    name: string | null;
    age: string | null;
    userType: string | null;
  } | null;
  auth: {
    accessToken: string | null;
    refreshToken: string | null;
  };
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  auth: {
    accessToken: null,
    refreshToken: null,
  },
  isAuthenticated: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{
      user: UserState["user"];
      accessToken: string;
      refreshToken: string;
    }>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.auth = {
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: () => {
      return initialState;
    },
    updateUserInfo: (state, action: PayloadAction<Partial<UserState["user"]>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    refreshToken: (state, action: PayloadAction<{ accessToken: string }>) => {
      state.auth.accessToken = action.payload.accessToken;
    },
  },
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  updateUserInfo, 
  refreshToken 
} = userSlice.actions;

export default userSlice.reducer;