import { CityName } from '../shared/entities/city/types'; // ← Правильный путь!

export type Offer = {
  id: string;
  title: string;
  type: string;
  price: number;
  city: CityName; // ← Используем enum CityName
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
  city: CityName; // ← Используем enum CityName
  offers: Offer[];
  filteredOffers: Offer[];
};
