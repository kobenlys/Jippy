import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import shopReducer from "./slices/shopSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    shop: shopReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["user/setUserToken"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;