import { createSlice } from "@reduxjs/toolkit";

const CLERK_SLICE = createSlice({
    name: 'citizen',
    initialState: { clerk: null, service: "", socket: null, busy: false, citizen_queue: [], current: null, citizen: null },
    reducers: {
        setService(state, action) {
            state.service = action.payload.service;
        },
        setClerk(state, action) {
            state.clerk = action.payload.clerk;
        },
        removeClerk(state) {
            state.clerk = null;
        },
        setSocket(state, action) {
            state.socket = action.payload.socket;
        },
        setBusyTrue(state) {
            state.busy = true;
            console.log(state)
        },
        setBusyFalse(state) {
            state.busy = false;
        },
        enQueue(state, action) {
            state.citizen_queue.push(action.payload.request);
        },
        deQueue(state, action) {
            state.citizen_queue.shift();
        },
        setCurrent(state, action) {
            state.current = action.payload.request;
        },
        removeCurrent(state) {
            state.current = null;
        },
        setCitizen(state, action) {
            state.citizen = action.payload.citizen;
        }

        // updateAppliedFor(state, action) {
        //     state.citizen.appliedFor.push(action.payload.appliedFor)
        // },
    }
});

export const CLERK_ACTIONS = CLERK_SLICE.actions;
export default CLERK_SLICE.reducer;