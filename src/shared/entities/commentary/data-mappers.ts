import {Commentary, CommentaryDto} from './types.ts';

export const commentaryFromDto = (commentary: CommentaryDto): Commentary => ({
  ...commentary,
  date: new Date(commentary.date),
});
