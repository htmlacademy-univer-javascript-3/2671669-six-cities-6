import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {DEFAULT_CITY} from '../../shared/entities/city/constant.ts';
import {extractCities} from '../../shared/entities/city/data-mappers.ts';
import {CitiesMap, City} from '../../shared/entities/city/types.ts';
import {groupOffersByCity, mapDtoToOffer} from '../../shared/entities/offer/data-mappers.ts';
import {Offer, OfferDto, OffersByCity} from '../../shared/entities/offer/types.ts';
import {ReducerName} from '../../shared/enums/reducer-names.ts';
import {createAppThunk} from '../../shared/redux-helpers/typed-thunk.ts';
import {offersUrl} from '../../shared/server/constants.ts';

type OffersState = {
  cities: CitiesMap;
  currentCity: City;
  offers: OffersByCity;
  currentCityOffers: Offer[];
  activeOfferId: Offer['id'] | null;
  isOffersLoading: boolean;
};

const initialState: OffersState = {
  cities: {},
  currentCity: DEFAULT_CITY,
  offers: {},
  currentCityOffers: [],
  activeOfferId: null,
  isOffersLoading: false,
};

export const loadOffers = createAppThunk(`${ReducerName.offers }/loadOffers`, async (_, thunkApi) => {
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
    setCity: (state: OffersState, action: PayloadAction<City>) => {
      const city = action.payload;
      state.currentCity = city;
      state.currentCityOffers = state.offers[city.name];
    },
    setActiveOffer: (state: OffersState, action: PayloadAction<Offer['id']>) => {
      state.activeOfferId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadOffers.pending, (state) => {
      state.isOffersLoading = true;
    }).addCase(loadOffers.fulfilled, (state, action) => {
      const offers = groupOffersByCity(action.payload.map(mapDtoToOffer));
      state.isOffersLoading = false;
      state.cities = extractCities(action.payload);
      state.offers = offers;
      state.currentCityOffers = offers[state.currentCity.name] ?? [];
    }).addCase(loadOffers.rejected, (state) => {
      state.isOffersLoading = false;
    });
  },
});

export const offersReducer = offersSlice.reducer;
export const {setCity, setActiveOffer} = offersSlice.actions;
