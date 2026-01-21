import {createAsyncThunk} from '@reduxjs/toolkit';
import {AxiosError} from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {vi} from 'vitest';
import {UserData} from '../shared/entities/user/types.ts';
import {ReducerName} from '../shared/enums/reducer-names.ts';
import {RootState} from '../shared/redux-helpers/typed-hooks.ts';
import {ThunkExtraArguments} from '../shared/redux-helpers/typed-thunk.ts';
import {axiosClient, BASE_URL, setupAxiosInterceptors} from '../shared/server/constants.ts';
import * as notifications from '../shared/utils/notifications.ts';
import {createStore} from './store';

const notifySpy = vi.spyOn(notifications, 'showErrorNotification');

describe('Redux Middleware', () => {
  it('should pass axios instance to async thunks', async () => {
    const testThunk = createAsyncThunk<string, void, {extra: ThunkExtraArguments}>(
      'test/thunk',
      (_, {extra}) => {
        return extra.axios.defaults.baseURL || '';
      }
    );

    const store = createStore();

    const result = await store.dispatch(testThunk());

    expect(result.meta.requestStatus).toBe('fulfilled');
    expect(result.payload).toBe(BASE_URL);
  });
});

describe('Axios Interceptors', () => {
  let mockAxios: MockAdapter;

  beforeEach(() => {
    axiosClient.interceptors.request.clear();
    axiosClient.interceptors.response.clear();

    mockAxios = new MockAdapter(axiosClient);
    notifySpy.mockClear();
  });

  afterEach(() => {
    mockAxios.restore();
    axiosClient.interceptors.request.clear();
    axiosClient.interceptors.response.clear();
  });

  it('should add X-Token header when user is authorized', async () => {
    const token = 'fake-token';
    const store = createStore({
      initialState: {
        [ReducerName.currentUser]: {userData: {token} as UserData}
      } as Partial<RootState>,
    });

    setupAxiosInterceptors(store, axiosClient);

    mockAxios.onGet('/test').reply(200);
    await axiosClient.get('/test');

    expect(mockAxios.history.get[0].headers).toHaveProperty('X-Token', token);
  });

  it('should NOT add X-Token header when user is unauthorized', async () => {
    const store = createStore({
      initialState: {
        [ReducerName.currentUser]: {userData: null},
      } as Partial<RootState>,
    });

    setupAxiosInterceptors(store, axiosClient);

    mockAxios.onGet('/test').reply(200);
    await axiosClient.get('/test');

    expect(mockAxios.history.get[0].headers).not.toHaveProperty('X-Token');
  });

  it('should handle Network Error', async () => {
    const store = createStore();
    setupAxiosInterceptors(store, axiosClient);

    const error = new AxiosError('Network Error');
    error.code = 'ERR_NETWORK';
    mockAxios.onGet('/error').reply(() => Promise.reject(error));

    await expect(axiosClient.get('/error')).rejects.toThrow();

    expect(notifySpy).toHaveBeenCalledWith('Connection error');
  });
});
