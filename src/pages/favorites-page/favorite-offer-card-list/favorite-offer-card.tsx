import {FC} from 'react';
import {Link} from 'react-router-dom';
import {Offer} from '../../../shared/entities/offer/types.ts';
import {RoutePath} from '../../../shared/enums/routes.ts';
import {useAppDispatch} from '../../../shared/redux-helpers/typed-hooks.ts';
import {FavoriteStatus} from '../../../shared/server/constants.ts';
import {changeFavoriteStatus} from '../../../slices/favorites-page-slice/favorites-page-slice.ts';

type FavoriteOfferCardProps = {
  offer: Offer;
};

export const FavoriteOfferCard: FC<FavoriteOfferCardProps> = ({offer}) => {
  const dispatch = useAppDispatch();
  const offerUrl = `/${RoutePath.OfferPage}/${offer.id}`;

  const bookmarkedClassList = ['place-card__bookmark-button', 'button'];
  if (offer.isFavorite) {
    bookmarkedClassList.push('place-card__bookmark-button--active');
  }

  const handleBookmarkClick = () => {
    dispatch(changeFavoriteStatus({
      offerId: offer.id,
      status: offer.isFavorite ? FavoriteStatus.NotFavorite : FavoriteStatus.Favorite,
    }));
  };

  return (
    <article key={offer.id} className="favorites__card place-card">
      {offer.isPremium && (
        <div className="place-card__mark">
          <span>Premium</span>
        </div>
      )}
      <div className="favorites__image-wrapper place-card__image-wrapper">
        <Link to={offerUrl}>
          <img className="place-card__image" src={offer.previewImage} width="150" height="110" alt="Place image"/>
        </Link>
      </div>
      <div className="favorites__card-info place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{offer.price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          <button
            className={bookmarkedClassList.join(' ')}
            type="button"
            onClick={handleBookmarkClick}
          >
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="#icon-bookmark"></use>
            </svg>
            <span className="visually-hidden">In bookmarks</span>
          </button>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{width: `${20 * offer.rating}%`}}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <h2 className="place-card__name">
          <Link to={offerUrl}>{offer.title}</Link>
        </h2>
        <p className="place-card__type">{offer.type}</p>
      </div>
    </article>
  );
};
