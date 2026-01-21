import React, {FC, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {OfferCardList} from '../../components/offer-card-list/offer-card-list.tsx';
import {SelectorOption} from '../../components/selector-widget/model/types.ts';
import {SelectorWidget} from '../../components/selector-widget/selector-widget.tsx';
import {DEFAULT_CITY} from '../../shared/entities/city/constants.ts';
import {OfferSortOption} from '../../shared/entities/offer/constants.ts';
import {Offer} from '../../shared/entities/offer/types.ts';
import {RoutePath} from '../../shared/enums/routes.ts';
import {useAppDispatch, useAppSelector} from '../../shared/redux-helpers/typed-hooks.ts';
import {FavoriteStatus} from '../../shared/server/constants.ts';
import {changeFavoriteStatus} from '../../slices/favorites-page-slice/favorites-page-slice.ts';
import {setActiveOffer, setOffersSort} from '../../slices/offers-slice/offers-slice.ts';
import {MapWrapper} from './map-wrapper.tsx';

const sortOptions: SelectorOption[] = [
  {key: OfferSortOption.popular, value: 'Popular'},
  {key: OfferSortOption.price_LtH, value: 'Price: low to high'},
  {key: OfferSortOption.price_HtL, value: 'Price: high to low'},
  {key: OfferSortOption.topRated, value: 'Top rated first'},
] satisfies Array<{key: OfferSortOption; value: string}>;

export const PlacesContainer: FC = React.memo(() => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentCity = useAppSelector((state) => state.offers.cities[state.offers.currentCity]) ?? DEFAULT_CITY;
  const offers = useAppSelector((state) => state.offers.currentCityOffers);
  const sort = useAppSelector((state) => state.offers.sortOption);
  const isAuthorized = useAppSelector((state) => !!state.currentUser.userData);

  const handleOfferHover = useCallback((offerId: Offer['id']) => {
    dispatch(setActiveOffer(offerId));
  }, [dispatch]);

  const handleChangeSort = useCallback((sortOption: SelectorOption['key']) => {
    dispatch(setOffersSort(sortOption as OfferSortOption));
  }, [dispatch]);

  const handleChangeFavoriteStatus = useCallback((offerId: Offer['id'], status: FavoriteStatus) => {
    if (isAuthorized) {
      dispatch(changeFavoriteStatus({offerId, status}));
    } else {
      navigate('/' + RoutePath.LoginPage);
    }
  }, [navigate, dispatch, isAuthorized]);

  return (
    <>
      <section className="cities__places places">
        <h2 className="visually-hidden">Places</h2>
        <b className="places__found">{offers.length} places to stay in {currentCity.name}</b>
        <SelectorWidget
          options={sortOptions}
          activeOptionKey={sort}
          onSelect={handleChangeSort}
        >
          Sort by
        </SelectorWidget>
        <OfferCardList
          offers={offers}
          containerClassName="cities__places-list places__list tabs__content"
          onCardHover={handleOfferHover}
          onChangeFavoriteStatus={handleChangeFavoriteStatus}
        />
      </section>
      <div className="cities__right-section">
        <MapWrapper/>
      </div>
    </>
  );
});

PlacesContainer.displayName = 'PlacesContainer';
