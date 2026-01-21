import {configureMockStore} from '@jedmao/redux-mock-store';
import {Action} from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import thunk from 'redux-thunk';
import {DEFAULT_CITY} from '../../shared/entities/city/constants.ts';
import {CityName} from '../../shared/entities/city/types.ts';
import {OfferSortOption} from '../../shared/entities/offer/constants.ts';
import {Offer} from '../../shared/entities/offer/types.ts';
import {ReducerName} from '../../shared/enums/reducer-names.ts';
import {extractActionTypes} from '../../shared/redux-helpers/test-helpers.ts';
import {RootState} from '../../shared/redux-helpers/typed-hooks.ts';
import {AppThunkDispatch} from '../../shared/redux-helpers/typed-thunk.ts';
import {axiosClient, offersUrl} from '../../shared/server/constants.ts';
import {loadOffers, offersReducer, offersSlice, setActiveOffer, setCity, setOffersSort} from './offers-slice.ts';

type StateType = ReturnType<(typeof offersSlice)['getInitialState']>;

const initialState = {
  cities: {},
  currentCity: DEFAULT_CITY.name,
  offers: {},
  favoriteOffersCount: 0,
  currentCityOffers: [],
  activeOfferId: null,
  sortOption: OfferSortOption.popular,
  isOffersLoading: false,
} satisfies StateType;

const mockOffer: Offer = {
  id: '1',
  title: 'Mock offer',
  type: 'apartment',
  price: 100,
  city: DEFAULT_CITY.name,
  location: DEFAULT_CITY.location,
  isPremium: false,
  isFavorite: false,
  rating: 5,
  previewImage: '',
};

const getState = (overrides: Partial<StateType> = {}): StateType => ({...initialState, ...overrides});

const buildOffer = (overrides: Partial<Offer> = {}): Offer => ({...mockOffer, ...overrides});

describe('offersSlice', () => {
  const mockAxios = new MockAdapter(axiosClient);
  const middleware = [thunk.withExtraArgument({axios: axiosClient})];
  const createMockStore = configureMockStore<RootState, Action<string>, AppThunkDispatch>(middleware);

  let store: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    store = createMockStore({[ReducerName.offers]: getState()});
  });

  it('should return the state with empty action', () => {
    const emptyAction = {type: ''};
    const expectedState = {
      cities: {},
      currentCity: 'Amsterdam',
      offers: {},
      favoriteOffersCount: 0,
      currentCityOffers: [],
      activeOfferId: null,
      sortOption: OfferSortOption.price_HtL,
      isOffersLoading: false,
    };

    const result = offersReducer(expectedState, emptyAction);
    expect(result).toEqual(expectedState);
  });

  it('should return default initial state', () => {
    const emptyAction = {type: ''};
    const result = offersReducer(undefined, emptyAction);
    expect(result).toEqual(getState());
  });

  it('should correctly update state with setCity action', () => {
    const initState = getState({
      currentCity: CityName.Amsterdam,
      offers: {
        [CityName.Amsterdam]: [buildOffer({city: CityName.Amsterdam})],
        [CityName.Brussels]: [buildOffer({city: CityName.Brussels})],
      },
      sortOption: OfferSortOption.price_HtL,
    });

    const result = offersReducer(initState, setCity(CityName.Brussels));
    expect(result.currentCity).toEqual(CityName.Brussels);
    expect(result.currentCityOffers).toEqual(initState.offers[CityName.Brussels]);
    expect(result.sortOption).toEqual(OfferSortOption.popular);
  });

  it('should correctly update state with setActiveOffer action', () => {
    const initState = getState({activeOfferId: '2'});
    const result = offersReducer(initState, setActiveOffer('3'));
    expect(result.activeOfferId).toEqual('3');
  });

  it('should correctly update state with setOffersSort action', () => {
    const initState = getState({sortOption: OfferSortOption.price_HtL});
    const result = offersReducer(initState, setOffersSort(OfferSortOption.price_LtH));
    expect(result.sortOption).toEqual(OfferSortOption.price_LtH);
  });

  describe('loadOffers', () => {
    it('should dispatch actions on success', async () => {
      mockAxios.onGet(offersUrl.offers).reply(200);
      await store.dispatch(loadOffers());
      const actions = extractActionTypes(store.getActions());
      expect(actions).toEqual([loadOffers.pending.type, loadOffers.fulfilled.type]);
    });

    it('should dispatch actions on fail', async () => {
      mockAxios.onGet(offersUrl.offers).reply(400);
      await store.dispatch(loadOffers());
      const actions = extractActionTypes(store.getActions());
      expect(actions).toEqual([loadOffers.pending.type, loadOffers.rejected.type]);
    });

    it('should return correct data', async () => {
      mockAxios.onGet(offersUrl.offers).reply(200, [buildOffer()]);
      await store.dispatch(loadOffers());

      const emittedActions = store.getActions();
      const fetchResult = emittedActions[1] as ReturnType<typeof loadOffers.fulfilled>;
      expect(fetchResult.payload).toEqual([buildOffer()]);
    });
  });
});
