// src/store/types.ts
import { CityName } from '../shared/entities/city/types';
import { SortingOption } from '../shared/entities/sorting/types';

export type Offer = {
  id: string;
  title: string;
  type: string;
  price: number;
  city: CityName;
  location: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
  rating: number;
  previewImage: string;
  isPremium: boolean;
  isFavorite: boolean;
};

export type AppState = {
  city: CityName;
  offers: Offer[];
  filteredOffers: Offer[];
  sortingOption: SortingOption;
  activeCardId: string | null;
};
