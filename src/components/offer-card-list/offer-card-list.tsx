import { useState } from 'react';
import { Offer } from '../../shared/entities/offer/types';
import OfferCard from '../offer-card-list/offer-card';

interface OffersListProps {
  offers: Offer[];
  onCardHover?: (offerId: string | null) => void;
}

function OffersList({ offers, onCardHover }: OffersListProps) {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const handleCardMouseEnter = (id: string) => {
    setActiveCardId(id);
    if (onCardHover) {
      onCardHover(id);
    }
  };

  const handleCardMouseLeave = () => {
    setActiveCardId(null);
    if (onCardHover) {
      onCardHover(null);
    }
  };

  return (
    <div className="cities__places-list places__list tabs__content">
      {offers.map((offer) => (
        <OfferCard
          key={offer.id}
          offer={offer}
          isActive={offer.id === activeCardId} // ✅ Используем activeCardId
          onMouseEnter={() => handleCardMouseEnter(offer.id)}
          onMouseLeave={handleCardMouseLeave}
        />
      ))}
    </div>
  );
}

export default OffersList;
