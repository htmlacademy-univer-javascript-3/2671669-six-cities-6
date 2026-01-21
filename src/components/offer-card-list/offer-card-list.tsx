import React, {FC} from 'react';
import {Offer} from '../../shared/entities/offer/types.ts';
import {FavoriteStatus} from '../../shared/server/constants.ts';
import {OfferCard} from './offer-card.tsx';
import PropTypes from 'prop-types';

type OfferCardsProps = {
  offers: Offer[];
  containerClassName?: string;
  onCardHover?: (offerId: Offer['id']) => void;
  onChangeFavoriteStatus?: (offerId: Offer['id'], status: FavoriteStatus) => void;
};

export const OfferCardList: FC<OfferCardsProps> = React.memo(({
  offers,
  containerClassName,
  onCardHover,
  onChangeFavoriteStatus,
}) => (
  <div className={containerClassName}>
    {offers.map((offer) => (
      <OfferCard
        key={offer.id}
        offer={offer}
        onMouseEnter={() => onCardHover?.(offer.id)}
        onChangeFavoriteStatus={onChangeFavoriteStatus}
      />
    ))}
  </div>
));

OfferCardList.propTypes = {
  offers: PropTypes.array.isRequired,
  containerClassName: PropTypes.string,
  onCardHover: PropTypes.func,
  onChangeFavoriteStatus: PropTypes.func,
};

OfferCardList.displayName = 'OfferCardList';
