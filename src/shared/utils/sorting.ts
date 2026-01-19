import { Offer } from '../entities/offer/types';
import { SortingOption } from '../entities/sorting/types';

export function sortOffers(offers: Offer[], option: SortingOption): Offer[] {
  const sortedOffers = [...offers];

  switch (option) {
    case 'Price: low to high':
      return sortedOffers.sort((a, b) => a.price - b.price);
    case 'Price: high to low':
      return sortedOffers.sort((a, b) => b.price - a.price);
    case 'Top rated first':
      return sortedOffers.sort((a, b) => b.rating - a.rating);
    case 'Popular':
    default:
      return offers; // Исходный порядок
  }
}
