import { configureStore } from "@reduxjs/toolkit";
import displayReducer from "./displaySlice.js";

export const store = configureStore({
  reducer: { display: displayReducer },
});
