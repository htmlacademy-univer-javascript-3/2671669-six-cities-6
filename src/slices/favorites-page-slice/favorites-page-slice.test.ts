import {configureMockStore} from '@jedmao/redux-mock-store';
import {Action} from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import thunk from 'redux-thunk';
import {ReducerName} from '../../shared/enums/reducer-names.ts';
import {extractActionTypes} from '../../shared/redux-helpers/test-helpers.ts';
import {RootState} from '../../shared/redux-helpers/typed-hooks.ts';
import {AppThunkDispatch} from '../../shared/redux-helpers/typed-thunk.ts';
import {axiosClient, FavoriteStatus, favoritesUrl} from '../../shared/server/constants.ts';
import {changeFavoriteStatus, favoritesPageReducer, favoritesPageSlice, loadFavorites} from './favorites-page-slice.ts';

type StateType = ReturnType<(typeof favoritesPageSlice)['getInitialState']>;

const initialState = {
  isFavoritesLoading: false,
  favorites: [],
  offersLoadingError: null,
} satisfies StateType;

const getState = (overrides: Partial<StateType> = {}): StateType => ({...initialState, ...overrides});

describe('offerPageSlice', () => {
  const mockAxios = new MockAdapter(axiosClient);
  const middleware = [thunk.withExtraArgument({axios: axiosClient})];
  const createMockStore = configureMockStore<RootState, Action<string>, AppThunkDispatch>(middleware);

  let store: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    store = createMockStore({[ReducerName.favoritesPage]: getState()});
  });

  it('should return the state with empty action', () => {
    const emptyAction = {type: ''};
    const expectedState = getState({isFavoritesLoading: true});
    const result = favoritesPageReducer(expectedState, emptyAction);
    expect(result).toEqual(expectedState);
  });

  it('should return default initial state', () => {
    const emptyAction = {type: ''};
    const expectedState = getState();
    const result = favoritesPageReducer(undefined, emptyAction);
    expect(result).toEqual(expectedState);
  });

  describe('loadFavorites', () => {
    it('should dispatch actions on success', async () => {
      mockAxios.onGet(favoritesUrl.favorite).reply(200);
      await store.dispatch(loadFavorites());
      const actions = extractActionTypes(store.getActions());
      expect(actions).toEqual([loadFavorites.pending.type, loadFavorites.fulfilled.type]);
    });

    it('should dispatch actions on fail', async () => {
      mockAxios.onGet(favoritesUrl.favorite).reply(400);
      await store.dispatch(loadFavorites());
      const actions = extractActionTypes(store.getActions());
      expect(actions).toEqual([loadFavorites.pending.type, loadFavorites.rejected.type]);
    });
  });

  describe('changeFavoriteStatus', () => {
    it('should dispatch actions on success', async () => {
      mockAxios.onPost(favoritesUrl.setFavoriteStatus('fakeId', FavoriteStatus.Favorite)).reply(200);
      await store.dispatch(changeFavoriteStatus({offerId: 'fakeId', status: FavoriteStatus.Favorite}));
      const actions = extractActionTypes(store.getActions());
      expect(actions).toEqual([changeFavoriteStatus.pending.type, changeFavoriteStatus.fulfilled.type]);
    });

    it('should dispatch actions on fail', async () => {
      mockAxios.onPost(favoritesUrl.setFavoriteStatus('fakeId', FavoriteStatus.Favorite)).reply(400);
      await store.dispatch(changeFavoriteStatus({offerId: 'fakeId', status: FavoriteStatus.Favorite}));
      const actions = extractActionTypes(store.getActions());
      expect(actions).toEqual([changeFavoriteStatus.pending.type, changeFavoriteStatus.rejected.type]);
    });
  });
});
