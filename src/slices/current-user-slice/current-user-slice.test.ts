import {configureMockStore} from '@jedmao/redux-mock-store';
import {Action} from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import thunk from 'redux-thunk';
import {vi} from 'vitest';
import {ReducerName} from '../../shared/enums/reducer-names.ts';
import {extractActionTypes} from '../../shared/redux-helpers/test-helpers.ts';
import {RootState} from '../../shared/redux-helpers/typed-hooks.ts';
import {AppThunkDispatch} from '../../shared/redux-helpers/typed-thunk.ts';
import {axiosClient, userUrl} from '../../shared/server/constants.ts';
import {RequestStatus} from '../../shared/server/request-status.ts';
import {checkUserLogin, currentUserReducer, currentUserSlice, userLogin, userLogout} from './current-user-slice.ts';

vi.mock('../../shared/utils/local-storage-helpers.ts', () => ({
  LocalStorageHelpers: {
    saveAuthToken: vi.fn(),
    removeAuthToken: vi.fn(),
  }
}));

type StateType = ReturnType<(typeof currentUserSlice)['getInitialState']>;

const initialState = {
  checkAuthStatus: RequestStatus.idle,
  isLogoutPending: false,
  isAuthInPending: false,
  authorizationError: null,
  userData: null,
} satisfies StateType;

const getState = (overrides: Partial<StateType> = {}): StateType => ({...initialState, ...overrides});

describe('currentUserSlice', () => {
  const mockAxios = new MockAdapter(axiosClient);
  const middleware = [thunk.withExtraArgument({axios: axiosClient})];
  const createMockStore = configureMockStore<RootState, Action<string>, AppThunkDispatch>(middleware);

  let store: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    store = createMockStore({[ReducerName.currentUser]: getState()});
    vi.clearAllMocks();
  });

  it('should return the state with empty action', () => {
    const emptyAction = {type: ''};
    const expectedState = {
      checkAuthStatus: RequestStatus.idle,
      isLogoutPending: true,
      isAuthInPending: true,
      authorizationError: null,
      userData: null,
    };

    const result = currentUserReducer(expectedState, emptyAction);
    expect(result).toEqual(expectedState);
  });

  it('should return default initial state', () => {
    const emptyAction = {type: ''};
    const expectedState = {
      checkAuthStatus: RequestStatus.idle,
      isLogoutPending: false,
      isAuthInPending: false,
      authorizationError: null,
      userData: null,
    };

    const result = currentUserReducer(undefined, emptyAction);
    expect(result).toEqual(expectedState);
  });

  describe('userLogin', () => {
    it('should dispatch actions on success', async () => {
      mockAxios.onPost(userUrl.login).reply(200, {token: 'mock-token'});
      await store.dispatch(userLogin({email: '', password: ''}));
      const actions = extractActionTypes(store.getActions());
      expect(actions).toEqual([userLogin.pending.type, userLogin.fulfilled.type]);
    });

    it('should dispatch actions on failure', async () => {
      mockAxios.onPost(userUrl.login).reply(400);
      await store.dispatch(userLogin({email: '', password: ''}));
      const actions = extractActionTypes(store.getActions());
      expect(actions).toEqual([userLogin.pending.type, userLogin.rejected.type]);
    });
  });

  describe('userLogout', () => {
    it('should dispatch actions on success', async () => {
      mockAxios.onDelete(userUrl.logout).reply(200);
      await store.dispatch(userLogout());
      const actions = extractActionTypes(store.getActions());
      expect(actions).toEqual([userLogout.pending.type, userLogout.fulfilled.type]);
    });

    it('should dispatch actions on failure', async () => {
      mockAxios.onDelete(userUrl.logout).reply(400);
      await store.dispatch(userLogout());
      const actions = extractActionTypes(store.getActions());
      expect(actions).toEqual([userLogout.pending.type, userLogout.rejected.type]);
    });
  });

  describe('checkUserLogin', () => {
    it('should dispatch actions on success', async () => {
      const mockToken = 'some-secret-token';
      mockAxios.onGet(userUrl.login).reply(200, {token: mockToken});

      await store.dispatch(checkUserLogin(mockToken));

      const actions = extractActionTypes(store.getActions());
      expect(actions).toEqual([checkUserLogin.pending.type, checkUserLogin.fulfilled.type]);
    });

    it('should dispatch actions on failure', async () => {
      const mockToken = 'invalid-token';
      mockAxios.onGet(userUrl.login).reply(401);

      await store.dispatch(checkUserLogin(mockToken));

      const actions = extractActionTypes(store.getActions());
      expect(actions).toEqual([checkUserLogin.pending.type, checkUserLogin.rejected.type]);
    });
  });
});
