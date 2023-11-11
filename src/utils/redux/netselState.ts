import { createInitalStaticTileRefs } from "@/app/natural-selection/model/constants";
import { TileRef } from "@/app/natural-selection/model/render";
import { StaticTileType } from "@/app/natural-selection/model/tile";
import { createSlice } from "@reduxjs/toolkit";

export interface NetselState {
  staticTileRefs: TileRef<StaticTileType>[][];
}

export const netsetStateSlice = createSlice({
  name: "netselState",
  initialState: {
    staticTileRefs: createInitalStaticTileRefs(),
  } as NetselState,
  reducers: {
    // modalOpen: (state) => {
    //   state.visiable = true;
    // },
    // modalClose: (state) => {
    //   state.visiable = false;
    // },
    // modalSwitch: (state) => {
    //   state.visiable = !state.visiable;
    // },
    // setChild: (state, action: { payload: JSX.Element }) => {
    //   state.child = action.payload;
    // },
  },
});

// export const { modalOpen, modalClose, modalSwitch, setChild } = netsetStateSlice.actions;

export default netsetStateSlice.reducer;
