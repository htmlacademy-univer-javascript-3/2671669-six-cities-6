import { CurrentUserState } from '../../slices/current-user-slice/current-user-slice';
import { FavoritesPageState } from '../../slices/favorites-page-slice/favorites-page-slice';
import { OfferPageState } from '../../slices/offer-page-slice/offer-page-slice';
import { OffersState } from '../../slices/offers-slice/offers-slice';

export interface RootState {
  offers: OffersState;
  currentUser: CurrentUserState;
  offerPage: OfferPageState;
  favoritesPage: FavoritesPageState;
}

export type ReduxState = {
  offers: OffersState;
  currentUser: CurrentUserState;
  offerPage: OfferPageState;
  favoritesPage: FavoritesPageState;
};
