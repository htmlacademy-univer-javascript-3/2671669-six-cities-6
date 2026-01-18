import {OfferSortOption} from './constants.ts';
import {Offer, OfferDto, OffersByCity} from './types.ts';

export const mapDtoToOffer = (dto: OfferDto): Offer => ({
  id: dto.id,
  title: dto.title,
  type: dto.type,
  price: dto.price,
  city: dto.city.name,
  location: dto.location,
  isPremium: dto.isPremium,
  isFavorite: dto.isFavorite,
  rating: dto.rating,
  previewImage: dto.previewImage,
});

export const groupOffersByCity = (offers: Offer[]): OffersByCity => {
  const offersByCity: OffersByCity = {};
  offers.forEach((offer) => {
    const city = offer.city;
    if (!Object.hasOwn(offersByCity, city)) {
      offersByCity[city] = [];
    }
    offersByCity[city].push(offer);
  });
  return offersByCity;
};

export const applySortToOffers = (offers: Offer[], sortOption: OfferSortOption): Offer[] => {
  switch (sortOption) {
    case OfferSortOption.popular:
      return offers;
    case OfferSortOption.topRated:
      return offers.sort((o1, o2) => o2.rating - o1.rating);
    case OfferSortOption.price_LtH:
      return offers.sort((o1, o2) => o1.price - o2.price);
    case OfferSortOption.price_HtL:
      return offers.sort((o1, o2) => o2.price - o1.price);
  }
};
