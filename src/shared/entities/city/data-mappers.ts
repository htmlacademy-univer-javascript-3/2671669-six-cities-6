import {OfferDto} from '../offer/types.ts';
import {CitiesMap} from './types.ts';

export const extractCities = (offers: OfferDto[]): CitiesMap => {
  const cities: CitiesMap = {};
  offers.forEach((offer) => {
    if (Object.hasOwn(cities, offer.city.name)) {
      return;
    }
    cities[offer.city.name] = offer.city;
  });
  return cities;
};
