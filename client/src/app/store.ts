import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/Auth/authSlice";
import productReducer from "../features/Products/productsSlice";
import cartReducer from "../features/Cart/cartSlice";
import userReducer from "../features/Admin/Users/userSlice";
import orderReducer from "../features/Orders/OrdersSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    cart: cartReducer,
    users: userReducer,
    orders: orderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
