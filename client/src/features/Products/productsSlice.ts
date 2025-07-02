import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Product {
  name: string;
  price: number;
  currency: string;
  description: string;
  image: string;
  _id: string;
}

export interface productState {
  products: Product[];
  currentProduct: Product | null;
}

const initialState: productState = {
  products: [],
  currentProduct: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setCurrentProduct: (state, action: PayloadAction<Product | null>) => {
      state.currentProduct = action.payload;
    },
  },
});

export const { setProducts, setCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
