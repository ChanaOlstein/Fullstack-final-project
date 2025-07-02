import { createSlice, type PayloadAction } from "@reduxjs/toolkit/react";
import type { CartItem } from "../Cart/cartSlice";

export interface Order {
  _id: string;
  customer: string;
  items: CartItem[];
  createdAt: string;
}

export interface OrderState {
  orders: Order[];
  selectedOrder?: Order | null;
}

const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    setSelectedOrder: (state, action: PayloadAction<Order | null>) => {
      state.selectedOrder = action.payload;
    },
  },
});

export const { setOrders } = orderSlice.actions;
export default orderSlice.reducer;
