import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerAPI, loginAPI, logoutAPI, refreshTokenApi } from "./authAPI";
import type { LoginResp, User } from "../../types/userTypes";

interface AuthState {
  user: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  checkedAuth: boolean; 
  error: string | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  user: null,
  status: "idle",
  checkedAuth: false,
  error: null,
  accessToken: null,
};

const extractError = (err: any, fallback: string) =>
  err.response?.data?.message ?? fallback;

export const registerUser = createAsyncThunk<
  User,
  { name: string; email: string; password: string },
  { rejectValue: string }
>("auth/register", async (data, { rejectWithValue }) => {
  try {
    return await registerAPI(data);
  } catch (err) {
    return rejectWithValue(extractError(err, "Registration failed"));
  }
});

export const loginUser = createAsyncThunk<
  LoginResp,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (data, { rejectWithValue }) => {
  try {
    return await loginAPI(data);
  } catch (err: any) {
    return rejectWithValue(extractError(err, "Login failed"));
  }
});

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await logoutAPI();
});

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async(_, thunkAPI) => {
    try {
      return await refreshTokenApi();
    } catch(err: any){
        return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to refresh token"
      );
    }
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Registration failed";
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.data.user;
        state.accessToken = action.payload.data.accessToken;
        state.checkedAuth = true;
        localStorage.setItem("accessToken", action.payload.data.accessToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Login failed";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.checkedAuth = true;
        localStorage.removeItem("accessToken");
      })
    .addCase(refreshToken.pending, (state) => {
        state.checkedAuth = false;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.data.accessToken;
        state.user = action.payload.data.user;
        state.checkedAuth = true;
        localStorage.setItem("accessToken", action.payload.data.accessToken);
      })
      .addCase(refreshToken.rejected, (state) => {
        state.checkedAuth = true;
        state.accessToken = null;
        state.user = null;
        localStorage.removeItem("accessToken");
      })
  },
});

export default authSlice.reducer;
