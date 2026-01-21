import {createSlice} from '@reduxjs/toolkit';
import {AxiosError} from 'axios';
import {commentaryFromDto} from '../../shared/entities/commentary/data-mappers.ts';
import {AddCommentaryRequestBody, Commentary, CommentaryDto} from '../../shared/entities/commentary/types.ts';
import {ErrorDto, ValidationErrorDto} from '../../shared/entities/error/types.ts';
import {mapDtoToOffer} from '../../shared/entities/offer/data-mappers.ts';
import {Offer, OfferDto, OfferExtendedDto} from '../../shared/entities/offer/types.ts';
import {ReducerName} from '../../shared/enums/reducer-names.ts';
import {createAppThunk} from '../../shared/redux-helpers/typed-thunk.ts';
import {commentsUrl, offersUrl} from '../../shared/server/constants.ts';
import {RequestStatus} from '../../shared/server/request-status.ts';
import {changeFavoriteStatus} from '../favorites-page-slice/favorites-page-slice.ts';

type AddCommentActionPayload = AddCommentaryRequestBody & {offerId: string};

type OffersPageState = {
  isOfferLoading: boolean;
  offerData: OfferExtendedDto | null;
  offersLoadingError: ErrorDto | null;

  isNearbyLoading: boolean;
  nearbyOffers: Offer[];
  nearbyLoadingError: ErrorDto | null;

  isCommentsLoading: boolean;
  comments: Commentary[];
  commentsLoadingError: ErrorDto | null;

  commentPostingState: RequestStatus;
  commentPostingError: ErrorDto | ValidationErrorDto | null;
};

const initialState: OffersPageState = {
  isOfferLoading: false,
  offerData: null,
  offersLoadingError: null,

  isNearbyLoading: false,
  nearbyOffers: [],
  nearbyLoadingError: null,

  isCommentsLoading: false,
  comments: [],
  commentsLoadingError: null,

  commentPostingState: RequestStatus.idle,
  commentPostingError: null,
};

export const loadOffer = createAppThunk(ReducerName.offerPage + '/loadOffer', async (offerId: string, thunkApi) => {
  try {
    const response = await thunkApi.extra.axios.get<OfferExtendedDto>(offersUrl.offer(offerId));
    return response.data;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const loadNearbyOffers = createAppThunk(ReducerName.offerPage + '/loadNearby', async (offerId: string, thunkApi) => {
  try {
    const response = await thunkApi.extra.axios.get<OfferDto[]>(offersUrl.nearby(offerId));
    return response.data;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const loadComments = createAppThunk(ReducerName.offerPage + '/loadComments', async (offerId: string, thunkApi) => {
  try {
    const response = await thunkApi.extra.axios.get<CommentaryDto[]>(commentsUrl.comments(offerId));
    return response.data;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const addComment = createAppThunk(
  ReducerName.offerPage + '/addComment',
  async ({offerId, ...body}: AddCommentActionPayload, thunkApi) => {
    try {
      const response = await thunkApi.extra.axios.post<CommentaryDto>(
        commentsUrl.addComment(offerId),
        body satisfies AddCommentaryRequestBody,
      );
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const offerPageSlice = createSlice({
  name: ReducerName.offerPage,
  initialState,
  reducers: {
    resetCommentPostingState: (state: OffersPageState) => {
      state.commentPostingState = RequestStatus.idle;
      state.commentPostingError = null;
    },
    handleCommentPostingResult: (state: OffersPageState) => {
      state.commentPostingState = RequestStatus.idle;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadOffer.pending, (state) => {
      state.isOfferLoading = true;
      state.offerData = null;
      state.offersLoadingError = null;
    }).addCase(loadOffer.fulfilled, (state, action) => {
      state.isOfferLoading = false;
      state.offerData = action.payload;
    }).addCase(loadOffer.rejected, (state, {payload}) => {
      const error = (payload as AxiosError<ErrorDto>).response?.data;
      state.isOfferLoading = false;
      state.offersLoadingError = error as ErrorDto;
    }).addCase(loadNearbyOffers.pending, (state) => {
      state.isNearbyLoading = true;
      state.nearbyOffers = [];
      state.nearbyLoadingError = null;
    }).addCase(loadNearbyOffers.fulfilled, (state, action) => {
      state.isNearbyLoading = false;
      state.nearbyOffers = action.payload.map(mapDtoToOffer);
    }).addCase(loadNearbyOffers.rejected, (state, {payload}) => {
      const error = (payload as AxiosError<ErrorDto>).response?.data;
      state.isNearbyLoading = false;
      state.nearbyLoadingError = error as ErrorDto;
    }).addCase(loadComments.pending, (state) => {
      state.isCommentsLoading = true;
      state.comments = [];
      state.commentsLoadingError = null;
    }).addCase(loadComments.fulfilled, (state, action) => {
      state.isCommentsLoading = false;
      state.comments = action.payload
        .map(commentaryFromDto)
        .toSorted((c1, c2) => c2.date.valueOf() - c1.date.valueOf());
    }).addCase(loadComments.rejected, (state, {payload}) => {
      const error = (payload as AxiosError<ErrorDto>).response?.data;
      state.isCommentsLoading = false;
      state.commentsLoadingError = error as ErrorDto;
    }).addCase(addComment.pending, (state) => {
      state.commentPostingState = RequestStatus.pending;
      state.commentPostingError = null;
    }).addCase(addComment.fulfilled, (state, action) => {
      state.commentPostingState = RequestStatus.success;
      state.comments.unshift(commentaryFromDto(action.payload));
    }).addCase(addComment.rejected, (state, {payload}) => {
      state.commentPostingState = RequestStatus.failure;
      const error = (payload as AxiosError<ErrorDto | ValidationErrorDto>).response?.data;
      state.commentPostingError = error as ErrorDto | ValidationErrorDto;
    }).addCase(changeFavoriteStatus.fulfilled, (state, action) => {
      const favoriteOffer = action.payload;
      const favoriteId = favoriteOffer.id;
      if (state.offerData?.id === favoriteId) {
        state.offerData.isFavorite = favoriteOffer.isFavorite;
      } else {
        state.nearbyOffers = state.nearbyOffers.map((offer) => offer.id === favoriteId
          ? {...offer, isFavorite: favoriteOffer.isFavorite}
          : offer
        );
      }
    });
  },
});

export const offerPageReducer = offerPageSlice.reducer;
export const {resetCommentPostingState, handleCommentPostingResult} = offerPageSlice.actions;
