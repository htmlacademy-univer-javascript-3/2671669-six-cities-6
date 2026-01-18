import {CityName} from '../city/types.ts';
import {Offer} from './types.ts';

const mockOffer: Offer = {
  id: 'fake-offer-id',
  title: 'House in countryside',
  type: 'house',
  price: 895,
  city: CityName.Paris,
  location: {
    latitude: 48,
    longitude: 2,
    zoom: 16
  },
  isPremium: false,
  isFavorite: false,
  rating: 2.7,
  previewImage: 'fake-server.com/img/1.png'
};

export const getMockOffer = (overrides: Partial<Offer> = {}): Offer => ({...mockOffer, ...overrides});
