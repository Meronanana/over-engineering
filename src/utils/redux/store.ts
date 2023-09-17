import { configureStore, combineReducers } from "@reduxjs/toolkit";
import modalStateReducer from "./modalState";

export const rootReducer = combineReducers({
  modalStateReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
