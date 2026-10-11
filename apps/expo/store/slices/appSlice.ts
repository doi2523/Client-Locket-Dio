import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type MainPage = "profile" | "home" | "messages";

export type HomePage = "main" | "history";

interface AppState {
  activePage: MainPage;
  homePage: HomePage;
}

const initialState: AppState = {
  activePage: "home",
  homePage: "main",
};

const appSlice = createSlice({
  name: "app",
  initialState,

  reducers: {
    setActivePage: (state, action: PayloadAction<MainPage>) => {
      state.activePage = action.payload;
    },

    setHomePage: (state, action: PayloadAction<HomePage>) => {
      state.homePage = action.payload;
    },
  },
});

export const { setActivePage, setHomePage } = appSlice.actions;

export default appSlice.reducer;
