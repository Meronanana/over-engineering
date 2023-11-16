import { configureStore, combineReducers } from "@reduxjs/toolkit";
import modalStateReducer from "./modalState";
import netselStateReducer from "./netselState";

export const rootReducer = combineReducers({
  modalStateReducer,
  netselStateReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof rootReducer>;
