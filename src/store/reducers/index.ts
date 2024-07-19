import { combineReducers } from "@reduxjs/toolkit";
import githubReducer from "./githubReducer";

export const rootReducer = combineReducers({
  github: githubReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
