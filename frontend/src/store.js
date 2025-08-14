import { configureStore } from "@reduxjs/toolkit";
import authRouter from './slices/authSlice';
import cartRouter from './slices/cartSlice';

const store = configureStore({
    reducer: {
        auth: authRouter,
        cart: cartRouter
    }
});

export default store;

