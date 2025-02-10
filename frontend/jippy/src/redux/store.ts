import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import shopReducer from "./slices/shopSlice";
import productReducer from "./slices/productSlice";
import recipeReducer from "./slices/recipeSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    shop: shopReducer,
    product: productReducer,
    recipe: recipeReducer,
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