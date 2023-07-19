import { createSlice } from "@reduxjs/toolkit";

const CLERK_SLICE = createSlice({
    name: 'citizen',
    initialState: { clerk: null, socket: null },
    reducers: {
        setClerk(state, action) {
            state.clerk = action.payload.clerk;
        },
        removeClerk(state) {
            state.clerk = null;
        },
        setSocket(state, action) {
            state.socket = action.payload.socket;
        }
        // updateAppliedFor(state, action) {
        //     state.citizen.appliedFor.push(action.payload.appliedFor)
        // },
    }
});

export const CLERK_ACTIONS = CLERK_SLICE.actions;
export default CLERK_SLICE.reducer;