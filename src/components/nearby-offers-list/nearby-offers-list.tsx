import { Offer } from '../../shared/entities/offer/types';
import OfferCard from '../offer-card-list/offer-card';

interface NearbyOffersListProps {
  offers: Offer[];
}

function NearbyOffersList({ offers }: NearbyOffersListProps) {
  return (
    <section className="near-places places">
      <h2 className="near-places__title">Other places in the neighbourhood</h2>
      <div className="near-places__list places__list">
        {offers.map((offer) => (
          <OfferCard
            key={offer.id}
            offer={offer}
            cardClassName="near-places__card"
            imageWrapperClassName="near-places__image-wrapper"
          />
        ))}
      </div>
    </section>
  );
}

export default NearbyOffersList;
