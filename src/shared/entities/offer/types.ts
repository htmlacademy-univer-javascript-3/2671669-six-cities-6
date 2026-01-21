import {Coordinates} from '../coordinates/coordinates.ts';

type OfferCommonDto = {
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
};

export type OfferDto = OfferCommonDto & {previewImage: string};

export type OfferExtendedDto = OfferCommonDto & {
  description: string;
  bedrooms: number;
  goods: [string];
  host: {
    name: string;
    avatarUrl: string;
    isPro: boolean;
  };
  images: [string];
  maxAdults: number;
};

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
};

export type OffersByCity = Record<Offer['city'], Offer[]>;
