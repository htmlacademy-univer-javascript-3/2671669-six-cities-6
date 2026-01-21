import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {DEFAULT_CITY} from '../../shared/entities/city/constants.ts';
import {extractCities} from '../../shared/entities/city/data-mappers.ts';
import {CitiesMap, City} from '../../shared/entities/city/types.ts';
import {OfferSortOption} from '../../shared/entities/offer/constants.ts';
import {applySortToOffers, groupOffersByCity, mapDtoToOffer} from '../../shared/entities/offer/data-mappers.ts';
import {Offer, OfferDto, OffersByCity} from '../../shared/entities/offer/types.ts';
import {ReducerName} from '../../shared/enums/reducer-names.ts';
import {createAppThunk} from '../../shared/redux-helpers/typed-thunk.ts';
import {offersUrl} from '../../shared/server/constants.ts';
import {changeFavoriteStatus} from '../favorites-page-slice/favorites-page-slice.ts';

export type OffersState = {
  cities: CitiesMap;
  currentCity: City['name'];
  offers: OffersByCity;
  favoriteOffersCount: number;
  currentCityOffers: Offer[];
  activeOfferId: Offer['id'] | null;
  sortOption: OfferSortOption;
  isOffersLoading: boolean;
};

const initialState: OffersState = {
  cities: {},
  currentCity: DEFAULT_CITY.name,
  offers: {},
  favoriteOffersCount: 0,
  currentCityOffers: [],
  activeOfferId: null,
  sortOption: OfferSortOption.popular,
  isOffersLoading: false,
};

export const loadOffers = createAppThunk(ReducerName.offers + '/loadOffers', async (_, thunkApi) => {
  try {
    const response = await thunkApi.extra.axios.get<OfferDto[]>(offersUrl.offers);
    return response.data;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const offersSlice = createSlice({
  name: ReducerName.offers,
  initialState,
  reducers: {
    setCity: (state: OffersState, action: PayloadAction<City['name']>) => {
      const city = action.payload;
      state.currentCity = city;
      state.currentCityOffers = state.offers[city] ?? [];
      state.sortOption = OfferSortOption.popular;
    },
    setActiveOffer: (state: OffersState, action: PayloadAction<Offer['id']>) => {
      state.activeOfferId = action.payload;
    },
    setOffersSort: (state: OffersState, action: PayloadAction<OfferSortOption>) => {
      const sort = action.payload;
      state.sortOption = sort;
      if (sort === OfferSortOption.popular) {
        state.currentCityOffers = state.offers[state.currentCity] ?? [];
      } else {
        state.currentCityOffers = applySortToOffers(state.currentCityOffers, sort);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadOffers.pending, (state) => {
      state.isOffersLoading = true;
      state.sortOption = OfferSortOption.popular;
      state.offers = {};
      state.favoriteOffersCount = 0;
      state.currentCityOffers = [];
      state.activeOfferId = null;
    }).addCase(loadOffers.fulfilled, (state, action) => {
      const offers = groupOffersByCity(action.payload.map(mapDtoToOffer));
      state.isOffersLoading = false;
      state.cities = extractCities(action.payload);
      state.offers = offers;
      state.favoriteOffersCount = action.payload.filter((offer) => offer.isFavorite).length;
      state.currentCityOffers = offers[state.currentCity] ?? [];
    }).addCase(loadOffers.rejected, (state) => {
      state.isOffersLoading = false;
    }).addCase(changeFavoriteStatus.fulfilled, (state, action) => {
      const favoriteOffer = action.payload;
      const cityOffers = state.offers[favoriteOffer.city.name];
      if (cityOffers) {
        const favoriteId = favoriteOffer.id;
        const newCityOffers = cityOffers.map((offer) => offer.id === favoriteId
          ? {...offer, isFavorite: favoriteOffer.isFavorite}
          : offer
        );
        state.offers = {
          ...state.offers,
          [favoriteOffer.city.name]: newCityOffers,
        };
        state.currentCityOffers = newCityOffers;
        state.favoriteOffersCount += favoriteOffer.isFavorite ? 1 : -1;
      }
    });
  },
});

export const offersReducer = offersSlice.reducer;
export const {setCity, setActiveOffer, setOffersSort} = offersSlice.actions;
