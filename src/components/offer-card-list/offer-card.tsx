// src/components/offer-card/offer-card.tsx (обновленный)
import { Offer } from '../../shared/entities/offer/types';

type OfferCardProps = {
  offer: Offer;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

function OfferCard({ offer, onMouseEnter, onMouseLeave }: OfferCardProps) {
  return (
    <article
      className="cities__card place-card"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {offer.isPremium && (
        <div className="place-card__mark">
          <span>Premium</span>
        </div>
      )}
      <div className="cities__image-wrapper place-card__image-wrapper">
        <img
          className="place-card__image"
          src={offer.previewImage}
          width="260"
          height="200"
          alt="Place image"
        />
      </div>
      <div className="place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">€{offer.price}</b>
            <span className="place-card__price-text">/&nbsp;night</span>
          </div>
        </div>
        <div className="place-card__rating">
          <div className="place-card__stars rating__stars">
            <span style={{ width: `${offer.rating * 20}%` }}></span>
          </div>
        </div>
        <h2 className="place-card__name">
          {offer.title}
        </h2>
        <p className="place-card__type">{offer.type}</p>
      </div>
    </article>
  );
}

export default OfferCard;
