export type CommentaryDto = {
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

export type Commentary = Pick<CommentaryDto, 'id' | 'user' | 'comment' | 'rating'> & {date: Date};

export type AddCommentaryRequestBody = {
  comment: string;
  rating: number;
};
