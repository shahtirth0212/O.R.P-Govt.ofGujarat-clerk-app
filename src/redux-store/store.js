import { configureStore } from "@reduxjs/toolkit";
import CLERK_SLICE_REDUCER from './slices/clerk-slice';
import AUTH_SLICE_REDUCER from './slices/auth-slice';


const STORE = configureStore({
    reducer: {
        clerk: CLERK_SLICE_REDUCER,
        auth: AUTH_SLICE_REDUCER
    }
});


export default STORE;