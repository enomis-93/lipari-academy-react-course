import { createSlice } from "@reduxjs/toolkit";

const displaySlice = createSlice({
  name: "display",
  initialState: { compact: false },
  reducers: {
    toggleCompact(state) {
      state.compact = !state.compact;
    },
  },
});

export const { toggleCompact } = displaySlice.actions;
export const selectCompact = (state) => state.display.compact;
export default displaySlice.reducer;
