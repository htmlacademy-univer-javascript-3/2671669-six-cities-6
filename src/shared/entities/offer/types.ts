import { Coordinates } from '../coordinates/coordinates';

export enum PlaceType {
  Apartment = 'Apartment',
}

export type OfferDto = {
  id: string;
  title: string;
  type: string;
  price: number;
  city: {
    name: string;
    location: {
      latitude: number;
      longitude: number;
      zoom: number;
    };
  };
  location: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
  isFavorite: boolean;
  isPremium: boolean;
  rating: number;
  previewImage: string;
}

export type Offer = {
  id: OfferDto['id'];
  title: OfferDto['title'];
  type: OfferDto['type'];
  price: OfferDto['price'];
  city: string;
  location: Coordinates;
  isPremium: OfferDto['isPremium'];
  isFavorite: OfferDto['isFavorite'];
  rating: OfferDto['rating'];
  previewImage: OfferDto['previewImage'];
}

export type OffersByCity = Record<Offer['city'], Offer[]>;
