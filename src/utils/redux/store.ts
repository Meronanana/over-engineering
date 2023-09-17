import { configureStore } from "@reduxjs/toolkit";
import modalStateReducer from "./modalState";

export const store = configureStore({
  reducer: { modalState: modalStateReducer },
});
