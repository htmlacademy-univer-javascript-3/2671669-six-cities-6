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
