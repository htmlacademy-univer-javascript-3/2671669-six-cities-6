import {Commentary} from './types.ts';

const mockCommentary: Commentary = {
  id: 'comment-fake-id',
  comment: 'Lorem ipsum dolor sit amet',
  date: new Date(),
  rating: 4,
  user: {
    name: 'Mollie',
    avatarUrl: 'fake-url.com/img/1',
    isPro: false,
  },
};

export const getMockCommentary = (overrides: Partial<Commentary> = {}): Commentary => ({...mockCommentary, ...overrides});
