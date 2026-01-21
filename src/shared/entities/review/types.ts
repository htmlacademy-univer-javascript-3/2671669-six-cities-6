export type Review = {
  id: string;
  date: string; // ISO string
  user: {
    name: string;
    avatarUrl: string;
    isPro: boolean;
  };
  comment: string;
  rating: number;
};
