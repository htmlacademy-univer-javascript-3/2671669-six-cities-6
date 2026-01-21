import {configureMockStore} from '@jedmao/redux-mock-store';
import {Action} from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import thunk from 'redux-thunk';
import {ReducerName} from '../../shared/enums/reducer-names.ts';
import {extractActionTypes} from '../../shared/redux-helpers/test-helpers.ts';
import {RootState} from '../../shared/redux-helpers/typed-hooks.ts';
import {AppThunkDispatch} from '../../shared/redux-helpers/typed-thunk.ts';
import {axiosClient, commentsUrl, offersUrl} from '../../shared/server/constants.ts';
import {RequestStatus} from '../../shared/server/request-status.ts';
import {addComment, loadComments, loadNearbyOffers, loadOffer, offerPageReducer, offerPageSlice, resetCommentPostingState} from './offer-page-slice.ts';

type StateType = ReturnType<(typeof offerPageSlice)['getInitialState']>;

const initialState = {
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
} satisfies StateType;

const getState = (overrides: Partial<StateType> = {}): StateType => ({...initialState, ...overrides});

describe('offerPageSlice', () => {
  const mockAxios = new MockAdapter(axiosClient);
  const middleware = [thunk.withExtraArgument({axios: axiosClient})];
  const createMockStore = configureMockStore<RootState, Action<string>, AppThunkDispatch>(middleware);

  let store: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    store = createMockStore({[ReducerName.offerPage]: getState()});
  });

  it('should return the state with empty action', () => {
    const emptyAction = {type: ''};
    const expectedState = getState({isOfferLoading: true, isNearbyLoading: true});
    const result = offerPageReducer(expectedState, emptyAction);
    expect(result).toEqual(expectedState);
  });

  it('should return default initial state', () => {
    const emptyAction = {type: ''};
    const expectedState = getState();
    const result = offerPageReducer(undefined, emptyAction);
    expect(result).toEqual(expectedState);
  });

  it('should correctly update state with resetCommentPostingState action', () => {
    const initState = getState({commentPostingState: RequestStatus.success});
    const result = offerPageReducer(initState, resetCommentPostingState);
    expect(result.commentPostingState).toEqual(RequestStatus.idle);
    expect(result.commentPostingError).toBeNull();
  });

  it('should correctly update state with handleCommentPostingResult action', () => {
    const initState = getState({commentPostingState: RequestStatus.success});
    const result = offerPageReducer(initState, resetCommentPostingState);
    expect(result.commentPostingState).toEqual(RequestStatus.idle);
  });

  describe('loadOffer', () => {
    it('should dispatch actions on success', async () => {
      mockAxios.onGet(offersUrl.offer('fakeId')).reply(200);
      await store.dispatch(loadOffer('fakeId'));
      const actions = extractActionTypes(store.getActions());
      expect(actions).toEqual([loadOffer.pending.type, loadOffer.fulfilled.type]);
    });

    it('should dispatch actions on fail', async () => {
      mockAxios.onGet(offersUrl.offer('fakeId')).reply(400);
      await store.dispatch(loadOffer('fakeId'));
      const actions = extractActionTypes(store.getActions());
      expect(actions).toEqual([loadOffer.pending.type, loadOffer.rejected.type]);
    });
  });

  describe('loadNearbyOffers', () => {
    it('should dispatch actions on success', async () => {
      mockAxios.onGet(offersUrl.nearby('fakeId')).reply(200);
      await store.dispatch(loadNearbyOffers('fakeId'));
      const actions = extractActionTypes(store.getActions());
      expect(actions).toEqual([loadNearbyOffers.pending.type, loadNearbyOffers.fulfilled.type]);
    });

    it('should dispatch actions on fail', async () => {
      mockAxios.onGet(offersUrl.nearby('fakeId')).reply(400);
      await store.dispatch(loadNearbyOffers('fakeId'));
      const actions = extractActionTypes(store.getActions());
      expect(actions).toEqual([loadNearbyOffers.pending.type, loadNearbyOffers.rejected.type]);
    });
  });

  describe('loadComments', () => {
    it('should dispatch actions on success', async () => {
      mockAxios.onGet(commentsUrl.comments('fakeId')).reply(200);
      await store.dispatch(loadComments('fakeId'));
      const actions = extractActionTypes(store.getActions());
      expect(actions).toEqual([loadComments.pending.type, loadComments.fulfilled.type]);
    });

    it('should dispatch actions on fail', async () => {
      mockAxios.onGet(commentsUrl.comments('fakeId')).reply(400);
      await store.dispatch(loadComments('fakeId'));
      const actions = extractActionTypes(store.getActions());
      expect(actions).toEqual([loadComments.pending.type, loadComments.rejected.type]);
    });
  });

  describe('addComment', () => {
    it('should dispatch actions on success', async () => {
      mockAxios.onPost(commentsUrl.addComment('fakeId')).reply(200);
      await store.dispatch(addComment({offerId: 'fakeId', rating: 5, comment: ''}));
      const actions = extractActionTypes(store.getActions());
      expect(actions).toEqual([addComment.pending.type, addComment.fulfilled.type]);
    });

    it('should dispatch actions on fail', async () => {
      mockAxios.onPost(commentsUrl.addComment('fakeId')).reply(400);
      await store.dispatch(addComment({offerId: 'fakeId', rating: 5, comment: ''}));
      const actions = extractActionTypes(store.getActions());
      expect(actions).toEqual([addComment.pending.type, addComment.rejected.type]);
    });
  });
});
