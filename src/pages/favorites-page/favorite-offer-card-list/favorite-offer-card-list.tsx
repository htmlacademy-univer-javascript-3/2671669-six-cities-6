import {FC} from 'react';
import {OffersByCity} from '../../../shared/entities/offer/types.ts';
import {FavoriteOfferCard} from './favorite-offer-card.tsx';

type FavoriteOfferCardListProps = {
  offers: OffersByCity;
};

export const FavoriteOfferCardList: FC<FavoriteOfferCardListProps> = ({offers}) => {
  return (
    <ul className="favorites__list">
      {Object.entries(offers).map(([city, cityOffers]) => (
        <li key={city} className="favorites__locations-items">
          <div className="favorites__locations locations locations--current">
            <div className="locations__item">
              <a className="locations__item-link" href="#">
                <span>{city}</span>
              </a>
            </div>
          </div>
          <div className="favorites__places">
            {cityOffers.map((offer) => (
              <FavoriteOfferCard key={offer.id} offer={offer}/>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
};
