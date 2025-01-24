import { configureStore } from "@reduxjs/toolkit";
import teamReducer from "./reducer/teamSlice";

export const store = configureStore({
    reducer: {
        team: teamReducer,
    },
});
