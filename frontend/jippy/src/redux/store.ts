import { configureStore } from "@reduxjs/toolkit";
import stockReducer from "./stockSlice";
import userReducer from "./slices/userSlice";
import shopReducer from "./slices/shopSlice";
import chatReducer from "./slices/chatSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    stock: stockReducer,
    shop: shopReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["user/setUserToken"],
      },
    }),
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