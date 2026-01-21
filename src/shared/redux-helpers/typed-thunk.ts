import {createAsyncThunk} from '@reduxjs/toolkit';
import {AxiosInstance} from 'axios';

export type ThunkExtraArguments = {axios: AxiosInstance};

export const createAppThunk = createAsyncThunk.withTypes<{extra: ThunkExtraArguments}>();
