import { createSlice } from "@reduxjs/toolkit";

const AUTH_SLICE = createSlice({
    name: 'auth',
    initialState: { token: null },
    reducers: {
        setToken(state, action) {
            state.token = action.payload.token;
        },
        removeToken(state) {
            state.token = null;
        }
    }
});

export const AUTH_ACTIONS = AUTH_SLICE.actions;
export default AUTH_SLICE.reducer;