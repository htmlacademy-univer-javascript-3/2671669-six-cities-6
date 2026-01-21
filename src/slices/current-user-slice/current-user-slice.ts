import {createSlice} from '@reduxjs/toolkit';
import {AxiosError} from 'axios';
import {AuthErrorResultDto, AuthSuccessResultDto, LoginRequestBody, UserData} from '../../shared/entities/user/types.ts';
import {ReducerName} from '../../shared/enums/reducer-names.ts';
import {createAppThunk} from '../../shared/redux-helpers/typed-thunk.ts';
import {userUrl} from '../../shared/server/constants.ts';
import {RequestStatus} from '../../shared/server/request-status.ts';
import {LocalStorageHelpers} from '../../shared/utils/local-storage-helpers.ts';

type CurrentUserState = {
  checkAuthStatus: RequestStatus;
  isLogoutPending: boolean;
  isAuthInPending: boolean;
  authorizationError: string | null;
  userData: UserData | null;
};

const initialState: CurrentUserState = {
  checkAuthStatus: RequestStatus.idle,
  isLogoutPending: false,
  isAuthInPending: false,
  authorizationError: null,
  userData: null,
};

export const checkUserLogin = createAppThunk(
  ReducerName.currentUser + '/checkUserLogin',
  async (token: string, thunkApi) => {
    try {
      const response = await thunkApi.extra.axios.get<AuthSuccessResultDto>(userUrl.login, {
        headers: {['X-Token']: token}
      });
      return response.data satisfies UserData;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const userLogin = createAppThunk(
  ReducerName.currentUser + '/login',
  async (body: LoginRequestBody, thunkApi) => {
    try {
      const response = await thunkApi.extra.axios.post<AuthSuccessResultDto>(userUrl.login, body);
      return response.data satisfies UserData;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const userLogout = createAppThunk(ReducerName.currentUser + '/logout', async (_, thunkApi) => {
  try {
    const response = await thunkApi.extra.axios.delete<void>(userUrl.logout);
    return response.data;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const currentUserSlice = createSlice({
  name: ReducerName.offers,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(userLogin.pending, (state) => {
      state.isAuthInPending = true;
      state.authorizationError = null;
      state.userData = null;
    }).addCase(userLogin.fulfilled, (state, action) => {
      state.isAuthInPending = false;
      const userData = action.payload;
      state.userData = userData;
      LocalStorageHelpers.saveAuthToken(userData.token);
    }).addCase(userLogin.rejected, (state, {payload}) => {
      const error = (payload as AxiosError<AuthErrorResultDto>)?.response?.data?.details[0].messages[0] ?? 'Some error occurred';
      state.isAuthInPending = false;
      state.authorizationError = error;
    }).addCase(userLogout.pending, (state) => {
      state.isLogoutPending = true;
      state.userData = null;
      LocalStorageHelpers.removeAuthToken();
    }).addCase(userLogout.fulfilled, (state) => {
      state.isLogoutPending = false;
    }).addCase(userLogout.rejected, (state) => {
      state.isLogoutPending = false;
    }).addCase(checkUserLogin.pending, (state) => {
      state.checkAuthStatus = RequestStatus.pending;
    }).addCase(checkUserLogin.fulfilled, (state, action) => {
      state.checkAuthStatus = RequestStatus.success;
      const userData = action.payload;
      state.userData = userData;
      LocalStorageHelpers.saveAuthToken(userData.token);
    }).addCase(checkUserLogin.rejected, (state) => {
      state.checkAuthStatus = RequestStatus.failure;
      state.userData = null;
      LocalStorageHelpers.removeAuthToken();
    });
  },
});

export const currentUserReducer = currentUserSlice.reducer;
