import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
  try {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : { items: [], coupon: null };
  } catch {
    return { items: [], coupon: null };
  }
};

const saveCartToStorage = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      const cart = action.payload;
      state.items = cart.items || [];
      state.coupon = cart.couponApplied || null;
      saveCartToStorage(state);
    },
    addItem: (state, action) => {
      const item = action.payload;
      const existing = state.items.find(
        (i) => i.productId === item.productId && i.variantId === item.variantId && i.size === item.size
      );
      if (existing) {
        existing.quantity += item.quantity || 1;
      } else {
        state.items.push({ ...item, quantity: item.quantity || 1 });
      }
      saveCartToStorage(state);
    },
    updateItemQty: (state, action) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find((i) => i._id === itemId || i.productId === itemId);
      if (item) {
        item.quantity = quantity;
      }
      saveCartToStorage(state);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((i) => i._id !== action.payload && i.productId !== action.payload);
      saveCartToStorage(state);
    },
    setCoupon: (state, action) => {
      state.coupon = action.payload;
      saveCartToStorage(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.coupon = null;
      saveCartToStorage(state);
    },
  },
});

export const { setCart, addItem, updateItemQty, removeItem, setCoupon, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartItemCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + (item.priceAtAdd || item.price || 0) * item.quantity, 0);
