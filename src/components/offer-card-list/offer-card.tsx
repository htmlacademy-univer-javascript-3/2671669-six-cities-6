import {FC, MouseEventHandler} from 'react';
import {Link} from 'react-router-dom';
import {RoutePath} from '../../shared/enums/routes.ts';
import {Offer} from '../../shared/entities/offer/types.ts';
type OfferCardProps = {
  offer: Offer;
  onMouseEnter: MouseEventHandler<HTMLElement>;
}

export const OfferCard: FC<OfferCardProps> = ({offer, onMouseEnter}) => {
  const {title, type, rating, price, previewImage, isPremium, isFavorite} = offer;

  const bookmarkedClassList = ['place-card__bookmark-button', 'button'];
  if (isFavorite) {
    bookmarkedClassList.push('place-card__bookmark-button--active');
  }

  return (
    <article className="cities__card place-card" onMouseEnter={onMouseEnter}>
      {isPremium && (
        <div className="place-card__mark">
          <span>Premium</span>
        </div>
      )}
      <div className="cities__image-wrapper place-card__image-wrapper">
        <a href="#">
          <img className="place-card__image" src={previewImage} width="260" height="200" alt="Place image"/>
        </a>
      </div>
      <div className="place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          <button className={bookmarkedClassList.join(' ')} type="button">
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="#icon-bookmark"></use>
            </svg>
            <span className="visually-hidden">To bookmarks</span>
          </button>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{width: `${20 * rating}%`}}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <h2 className="place-card__name">
          <Link to={`/${RoutePath.OfferPage}/${offer.id}`}>{title}</Link>
        </h2>
        <p className="place-card__type">{type}</p>
      </div>
    </article>
  );
};

