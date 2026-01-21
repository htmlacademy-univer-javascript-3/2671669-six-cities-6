import {Action, createAsyncThunk, ThunkDispatch} from '@reduxjs/toolkit';
import {AxiosInstance} from 'axios';
import {RootState} from './typed-hooks.ts';

export type ThunkExtraArguments = {axios: AxiosInstance};
export type AppThunkDispatch = ThunkDispatch<RootState, ThunkExtraArguments, Action>;

export const createAppThunk = createAsyncThunk.withTypes<{extra: ThunkExtraArguments}>();
