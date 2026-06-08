import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    addItem: (state, action) => {
      const { productId, variantSku, qty, price, name } = action.payload;
      const existing = state.items.find((i) => i.productId === productId && i.variantSku === variantSku);
      if (existing) {
        existing.qty += qty;
      } else {
        state.items.push({ productId, variantSku, qty, price, name });
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(
        (i) => !(i.productId === action.payload.productId && i.variantSku === action.payload.variantSku)
      );
    },
    updateQty: (state, action) => {
      const item = state.items.find((i) => i.productId === action.payload.productId && i.variantSku === action.payload.variantSku);
      if (item) item.qty = action.payload.qty;
    },
    clearCart: (state) => { state.items = []; },
  },
});

export const { addItem, removeItem, updateQty, clearCart } = cartSlice.actions;
export const selectCartTotal = (state) => state.cart.items.reduce((s, i) => s + i.price * i.qty, 0);
export default cartSlice.reducer;
