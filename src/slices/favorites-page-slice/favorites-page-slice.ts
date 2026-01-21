import {createSlice} from '@reduxjs/toolkit';
import {AxiosError} from 'axios';
import {ErrorDto} from '../../shared/entities/error/types.ts';
import {mapDtoToOffer} from '../../shared/entities/offer/data-mappers.ts';
import {Offer, OfferDto, OfferExtendedDto} from '../../shared/entities/offer/types.ts';
import {ReducerName} from '../../shared/enums/reducer-names.ts';
import {createAppThunk} from '../../shared/redux-helpers/typed-thunk.ts';
import {FavoriteStatus, favoritesUrl} from '../../shared/server/constants.ts';

type FavoritePageState = {
  isFavoritesLoading: boolean;
  favorites: Offer[];
  offersLoadingError: ErrorDto | null;
};

const initialState: FavoritePageState = {
  isFavoritesLoading: false,
  favorites: [],
  offersLoadingError: null,
};

export const loadFavorites = createAppThunk(ReducerName.favoritesPage + '/loadFavorites', async (_, thunkApi) => {
  try {
    const response = await thunkApi.extra.axios.get<OfferDto[]>(favoritesUrl.favorite);
    return response.data;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const changeFavoriteStatus = createAppThunk(
  ReducerName.favoritesPage + '/changeFavoriteStatus',
  async ({offerId, status}: {offerId: Offer['id']; status: FavoriteStatus}, thunkApi) => {
    try {
      const response = await thunkApi.extra.axios.post<OfferExtendedDto>(favoritesUrl.setFavoriteStatus(offerId, status));
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const favoritesPageSlice = createSlice({
  name: ReducerName.favoritesPage,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadFavorites.pending, (state) => {
      state.isFavoritesLoading = true;
    }).addCase(loadFavorites.fulfilled, (state, action) => {
      state.isFavoritesLoading = false;
      state.favorites = action.payload.map(mapDtoToOffer);
    }).addCase(loadFavorites.rejected, (state, {payload}) => {
      state.isFavoritesLoading = false;
      const error = (payload as AxiosError<ErrorDto>).response?.data;
      state.offersLoadingError = error as ErrorDto;
    }).addCase(changeFavoriteStatus.fulfilled, (state, action) => {
      const favoriteOffer = action.payload;
      if (!favoriteOffer.isFavorite) {
        const favoriteId = favoriteOffer.id;
        state.favorites = state.favorites.filter((offer) => offer.id !== favoriteId);
      }
    });
  },
});

export const favoritesPageReducer = favoritesPageSlice.reducer;
