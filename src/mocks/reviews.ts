export type Review = {
  id: string;
  date: string;
  user: {
    name: string;
    avatarUrl: string;
    isPro: boolean;
  };
  comment: string;
  rating: number;
};

export const mockReviews: Review[] = [
  {
    id: '1',
    date: '2024-04-01',
    user: {
      name: 'Max',
      avatarUrl: 'img/avatar-max.jpg',
      isPro: false,
    },
    comment: 'A quiet cozy and picturesque that hides behind a a river by the unique lightness of Amsterdam.',
    rating: 4,
  },
  {
    id: '2',
    date: '2024-03-28',
    user: {
      name: 'Angelina',
      avatarUrl: 'img/avatar-angelina.jpg',
      isPro: true,
    },
    comment: 'The room was spacious and clean. The location is great!',
    rating: 5,
  },
];
