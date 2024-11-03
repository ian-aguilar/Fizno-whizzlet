import { UserType } from "@fizno/api-client/src/models/CreateUserResponseDto";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { JWTUserClaims } from "../../helpers/token";
import { RootState } from "../../redux/store";
interface GlobalCacheInitialState {
  user: UserType | undefined | null;
  userId: string;
  accessToken: string;
  userExtension: string;
  userClaims: JWTUserClaims | undefined | null;
  preLoader: boolean;
  alertMessage: {
    message: string;
    severity: "success" | "error";
    open: boolean;
  };
}

const initialState: GlobalCacheInitialState = {
  user: undefined,
  userId: "",
  accessToken: "",
  userExtension: "",
  userClaims: undefined,
  preLoader: false,
  alertMessage: {
    message: "",
    severity: "error",
    open: false,
  },
};

const globalCacheSlice = createSlice({
  name: "globalCache",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setUserExtension: (state, action: PayloadAction<string>) => {
      state.userExtension = action.payload;
    },
    setPreLoader: (state, action: PayloadAction<boolean>) => {
      state.preLoader = action.payload;
    },
    setAlertMessage: (
      state,
      action: PayloadAction<{
        message: string;
        severity: "success" | "error";
        open: boolean;
      }>
    ) => {
      state.alertMessage = action.payload;
    },
    closeSnackbar: (state) => {
      state.alertMessage.open = false;
    },
  },
});

export const {
  setUser,
  setUserId,
  setAccessToken,
  setUserExtension,
  setPreLoader,
  setAlertMessage,
  closeSnackbar,
} = globalCacheSlice.actions;

export const globalCacheStateSelector = (state: RootState) => state.globalCache;
export default globalCacheSlice.reducer;
