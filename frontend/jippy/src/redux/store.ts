import { configureStore } from "@reduxjs/toolkit";
import stockReducer from "./stockSlice";
import userReducer from "./slices/userSlice";
import shopReducer from "./slices/shopSlice";
import productReducer from "./slices/productSlice";
import categoryReducer from './slices/categorySlice';
import recipeReducer from "./slices/recipeSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    stock: stockReducer,
    shop: shopReducer,
    product: productReducer,
    category: categoryReducer,
    recipe: recipeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["user/setUserToken"],
      },
    }),
    devTools: process.env.NODE_ENV !== "production", // ✅ DevTools 활성화
});
  
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;