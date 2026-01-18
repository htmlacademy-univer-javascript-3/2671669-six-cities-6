import { Offer } from '../shared/entities/offer/types';

export const mockOffers: Offer[] = [
  {
    id: '1',
    title: 'Beautiful & luxurious apartment at great location',
    type: 'Apartment',
    price: 120,
    city: 'Amsterdam',
    location: {
      latitude: 52.3909553943508, // ✅ Координаты из задания
      longitude: 4.85309666406198,
      zoom: 10,
    },
    rating: 4.8,
    previewImage: 'img/apartment-01.jpg',
    isPremium: true,
    isFavorite: false,
  },
  {
    id: '2',
    title: 'Wood and stone place',
    type: 'Private room',
    price: 80,
    city: 'Amsterdam',
    location: {
      latitude: 52.3609553943508, // ✅ Координаты из задания
      longitude: 4.85309666406198,
      zoom: 10,
    },
    rating: 4.2,
    previewImage: 'img/room.jpg',
    isPremium: false,
    isFavorite: true,
  },
  {
    id: '3',
    title: 'Canal View Prinsengracht',
    type: 'Apartment',
    price: 132,
    city: 'Amsterdam',
    location: {
      latitude: 52.3909553943508, // ✅ Координаты из задания
      longitude: 4.929309666406198,
      zoom: 10,
    },
    rating: 4.7,
    previewImage: 'img/apartment-02.jpg',
    isPremium: false,
    isFavorite: false,
  },
  {
    id: '4',
    title: 'Nice, cozy, warm big bed apartment',
    type: 'Apartment',
    price: 180,
    city: 'Amsterdam',
    location: {
      latitude: 52.3809553943508, // ✅ Координаты из задания
      longitude: 4.939309666406198,
      zoom: 10,
    },
    rating: 5.0,
    previewImage: 'img/apartment-03.jpg',
    isPremium: true,
    isFavorite: false,
  },
  {
    id: '5',
    title: 'Wood and stone place',
    type: 'Private room',
    price: 80,
    city: 'Paris', // Этот в Париже, не показывать на карте Амстердама
    location: {
      latitude: 48.85661,
      longitude: 2.351499,
      zoom: 10,
    },
    rating: 4.2,
    previewImage: 'img/room.jpg',
    isPremium: false,
    isFavorite: false,
  },
];
