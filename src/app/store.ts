import {configureStore} from '@reduxjs/toolkit';
import {Reducer} from 'redux';
import {ReducerName} from '../shared/enums/reducer-names.ts';
import {ThunkExtraArguments} from '../shared/redux-helpers/typed-thunk.ts';
import {axiosClient, setupAxiosInterceptors} from '../shared/server/constants.ts';
import {currentUserReducer} from '../slices/current-user-slice/current-user-slice.ts';
import {favoritesPageReducer} from '../slices/favorites-page-slice/favorites-page-slice.ts';
import {offerPageReducer} from '../slices/offer-page-slice/offer-page-slice.ts';
import {offersReducer} from '../slices/offers-slice/offers-slice.ts';

type StateSchema = {
  [ReducerName.currentUser]: ReturnType<typeof currentUserReducer>;
  [ReducerName.offers]: ReturnType<typeof offersReducer>;
  [ReducerName.offerPage]: ReturnType<typeof offerPageReducer>;
  [ReducerName.favoritesPage]: ReturnType<typeof favoritesPageReducer>;
};

export const createStore = ({initialState}: {initialState?: Partial<StateSchema>} = {}) => {
  return configureStore({
    reducer: {
      [ReducerName.currentUser]: currentUserReducer,
      [ReducerName.offers]: offersReducer,
      [ReducerName.offerPage]: offerPageReducer,
      [ReducerName.favoritesPage]: favoritesPageReducer,
    } satisfies Record<ReducerName, Reducer>,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: false,
      thunk: {extraArgument: {axios: axiosClient} satisfies ThunkExtraArguments},
    }),
  });
};

export const store = createStore();
setupAxiosInterceptors(store, axiosClient);
