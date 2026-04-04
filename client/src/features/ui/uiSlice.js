import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchOpen: false,
  mobileMenuOpen: false,
  quickViewProduct: null,
  sizeGuideOpen: false,
  cartDrawerOpen: false,
  loading: false,
  notification: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSearch: (state) => { state.searchOpen = !state.searchOpen; },
    setSearchOpen: (state, action) => { state.searchOpen = action.payload; },
    toggleMobileMenu: (state) => { state.mobileMenuOpen = !state.mobileMenuOpen; },
    setMobileMenuOpen: (state, action) => { state.mobileMenuOpen = action.payload; },
    setQuickViewProduct: (state, action) => { state.quickViewProduct = action.payload; },
    toggleSizeGuide: (state) => { state.sizeGuideOpen = !state.sizeGuideOpen; },
    toggleCartDrawer: (state) => { state.cartDrawerOpen = !state.cartDrawerOpen; },
    setLoading: (state, action) => { state.loading = action.payload; },
    setNotification: (state, action) => { state.notification = action.payload; },
    clearNotification: (state) => { state.notification = null; },
  },
});

export const {
  toggleSearch, setSearchOpen,
  toggleMobileMenu, setMobileMenuOpen,
  setQuickViewProduct, toggleSizeGuide,
  toggleCartDrawer, setLoading,
  setNotification, clearNotification,
} = uiSlice.actions;
export default uiSlice.reducer;
