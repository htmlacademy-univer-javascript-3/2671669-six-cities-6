import {FC, useCallback, useEffect} from 'react';
import {Navigate, useNavigate, useParams} from 'react-router-dom';
import {MapWidget} from '../../components/map-widget/map-widget.tsx';
import {PointOnMap} from '../../components/map-widget/model/types.ts';
import {OfferCardList} from '../../components/offer-card-list/offer-card-list.tsx';
import {Spinner} from '../../components/spinner/spinner.tsx';
import {Offer, OfferExtendedDto} from '../../shared/entities/offer/types.ts';
import {RoutePath} from '../../shared/enums/routes.ts';
import {useAppDispatch, useAppSelector} from '../../shared/redux-helpers/typed-hooks.ts';
import {FavoriteStatus} from '../../shared/server/constants.ts';
import {changeFavoriteStatus} from '../../slices/favorites-page-slice/favorites-page-slice.ts';
import {loadNearbyOffers, loadOffer} from '../../slices/offer-page-slice/offer-page-slice.ts';
import {CommentsList} from './comments-list.tsx';
import {FeedbackForm} from './feedback-form.tsx';
import {OfferPageWrapper} from './offer-page-wrapper.tsx';

const offerToPointOnMap = (offer: Offer | OfferExtendedDto): PointOnMap => ({
  id: offer.id,
  coordinates: offer.location,
  popupNode: offer.title,
});

export const OfferPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {id: offerId = ''} = useParams();
  const isAuthorized = useAppSelector((state) => !!state.currentUser.userData);
  const offerData = useAppSelector((state) => state.offerPage.offerData);
  const nearbyOffers = useAppSelector((state) => state.offerPage.nearbyOffers).slice(0, 3);
  const loadError = useAppSelector((state) => state.offerPage.offersLoadingError);
  const loadErrorNearby = useAppSelector((state) => state.offerPage.nearbyLoadingError);

  const handleChangeFavoriteStatus = useCallback((ofId: Offer['id'], status: FavoriteStatus) => {
    if (isAuthorized) {
      dispatch(changeFavoriteStatus({offerId: ofId, status}));
    } else {
      navigate('/' + RoutePath.LoginPage);
    }
  }, [navigate, dispatch, isAuthorized]);

  useEffect(() => {
    dispatch(loadOffer(offerId));
    dispatch(loadNearbyOffers(offerId));
  }, [dispatch, offerId]);

  if (loadError || loadErrorNearby) {
    return <Navigate to={'/' + RoutePath.Page404}/>;
  }

  if (!offerData) {
    return (
      <OfferPageWrapper>
        <Spinner/>
      </OfferPageWrapper>
    );
  }

  const markers: PointOnMap[] = [offerData, ...nearbyOffers].map(offerToPointOnMap);
  const roundedRating = Math.max(1, Math.min(5, Math.round(offerData?.rating ?? 0)));

  const bookmarkClassnames = ['offer__bookmark-button', 'button'];
  if (offerData.isFavorite) {
    bookmarkClassnames.push('offer__bookmark-button--active');
  }

  const hostAvatarClassnames = ['offer__avatar-wrapper', 'user__avatar-wrapper'];
  if (offerData.host.isPro) {
    hostAvatarClassnames.push('offer__avatar-wrapper--pro');
  }

  return (
    <OfferPageWrapper>
      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {offerData.images.map((img) => (
                <div key={img} className="offer__image-wrapper">
                  <img className="offer__image" src={img} alt="Photo studio"/>
                </div>
              ))}
            </div>
          </div>
          <div className="offer__container container">
            <div className="offer__wrapper">
              {offerData.isPremium && (
                <div className="offer__mark">
                  <span>Premium</span>
                </div>
              )}
              <div className="offer__name-wrapper">
                <h1 className="offer__name">{offerData.title}</h1>
                <button
                  className={bookmarkClassnames.join(' ')}
                  type="button"
                  onClick={() => handleChangeFavoriteStatus(offerId, offerData.isFavorite ? FavoriteStatus.NotFavorite : FavoriteStatus.Favorite)}
                >
                  <svg className="offer__bookmark-icon " width="31" height="33">
                    <use xlinkHref="#icon-bookmark"></use>
                  </svg>
                  <span className="visually-hidden">To bookmarks</span>
                </button>
              </div>
              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span style={{width: roundedRating * 20 + '%'}}></span>
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">{offerData.rating}</span>
              </div>
              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">
                  {offerData.type}
                </li>
                <li className="offer__feature offer__feature--bedrooms">
                  {offerData.bedrooms} Bedroom{offerData.bedrooms > 1 && 's'}
                </li>
                <li className="offer__feature offer__feature--adults">
                  Max {offerData.maxAdults} adult{offerData.maxAdults > 1 && 's'}
                </li>
              </ul>
              <div className="offer__price">
                <b className="offer__price-value">&euro;{offerData.price}</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>
              <div className="offer__inside">
                <h2 className="offer__inside-title">What&apos;s inside</h2>
                <ul className="offer__inside-list">
                  {offerData.goods.map((good) => (
                    <li key={good} className="offer__inside-item">{good}</li>
                  ))}
                </ul>
              </div>
              <div className="offer__host">
                <h2 className="offer__host-title">Meet the host</h2>
                <div className="offer__host-user user">
                  <div className={hostAvatarClassnames.join(' ')}>
                    <img className="offer__avatar user__avatar" src={offerData.host.avatarUrl} width="74" height="74" alt="Host avatar"/>
                  </div>
                  <span className="offer__user-name">
                    {offerData.host.name}
                  </span>
                  {offerData.host.isPro && <span className="offer__user-status">Pro</span>}
                </div>
                <div className="offer__description">
                  {offerData.description.split('\n').map((p) => (
                    <p key={p} className="offer__text">{p}</p>
                  ))}
                </div>
              </div>
              <section className="offer__reviews reviews">
                <CommentsList/>
                {isAuthorized && <FeedbackForm offerId={offerId}/>}
              </section>
            </div>
          </div>
          <MapWidget
            mapCenter={{...offerData.location, zoom: 14}}
            mapContainerClassName="offer__map map"
            markers={markers}
            activeMarkers={[offerData.id]}
            scrollWheelZoom={false}
          />
        </section>
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">Other places in the neighbourhood</h2>
            <OfferCardList
              offers={nearbyOffers}
              containerClassName="near-places__list places__list"
              onChangeFavoriteStatus={handleChangeFavoriteStatus}
            />
          </section>
        </div>
      </main>
    </OfferPageWrapper>
  );
};
