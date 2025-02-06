import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import stockReducer from "./stockSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    stock: stockReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export function createStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      stock: stockReducer,
    },
    preloadedState, // 서버에서 데이터를 받아 초기 상태 설정 가능
  });
}

export type AppStore = ReturnType<typeof createStore>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;