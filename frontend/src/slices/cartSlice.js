import { createSlice } from "@reduxjs/toolkit";

// 초기 상태
const initialState = {
  items: [], // 장바구니 상품 목록 [{ id, name, price, image, quantity }, ...]
  purchaseItem: null, // 바로 구매용 상품 1개
};

const cartSlice = createSlice({
  name: "cart", // state.cart로 접근 가능
  initialState,
  reducers: {
    // 상품 추가
    addToCart(state, action) {
      const newItem = action.payload;
      const existing = state.items.find(i => i.id === newItem.id);
      if (existing) {
        existing.count += newItem.count ?? 1; // 방어코드 추가 // newItem.count가 undefined이면 NaN
      } else {
        state.items.push({ ...newItem, count: newItem.count ?? 1 }); // 새 상품 추가
      }
    },

    // 수량 증가
    increaseQuantity(state, action) {
      const item = state.items.find(i => i.id === action.payload);
      if (item) item.count += 1;
    },

    // 수량 감소
    decreaseQuantity(state, action) {
      const item = state.items.find(i => i.id === action.payload);
      if (item && item.count > 1) item.count -= 1;
    },

    // 장바구니 비우기
    clearCart(state) {
      state.items = [];
    },

    // 특정 상품 제거
    removeFromCart(state, action) {
      const productId = action.payload;
      state.items = state.items.filter(item => item.id !== productId);
    },

    // 바로 구매용 상품 저장
    purchaseNow(state, action) {
      state.purchaseItem = action.payload;
    },
  },
});

// 액션과 리듀서 export
export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  removeFromCart,
  purchaseNow,
} = cartSlice.actions;

export default cartSlice.reducer;
