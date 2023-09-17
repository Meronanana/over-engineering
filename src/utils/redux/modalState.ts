import { createSlice } from "@reduxjs/toolkit";

export const modalStateSlice = createSlice({
  name: "modalState",
  initialState: {
    visiable: false,
    child: null,
  },
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
    setChild: (state, action) => {
      state.child = action.payload;
    },
  },
});

export const { modalOpen, modalClose, modalSwitch, setChild } = modalStateSlice.actions;

export default modalStateSlice.reducer;
