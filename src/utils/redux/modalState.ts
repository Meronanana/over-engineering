import { createSlice } from "@reduxjs/toolkit";

export interface ModalState {
  visiable: boolean;
  child: JSX.Element | null;
}

export const modalStateSlice = createSlice({
  name: "modalState",
  initialState: {
    visiable: false,
    child: null,
  } as ModalState,
  reducers: {
    modalOpen: (state) => {
      state.visiable = true;
    },
    modalClose: (state) => {
      state.visiable = false;
    },
    modalSwitch: (state) => {
      state.visiable = !state.visiable;
    },
    setChild: (state, action: { payload: JSX.Element }) => {
      state.child = action.payload;
    },
  },
});

export const { modalOpen, modalClose, modalSwitch, setChild } = modalStateSlice.actions;

export default modalStateSlice.reducer;
