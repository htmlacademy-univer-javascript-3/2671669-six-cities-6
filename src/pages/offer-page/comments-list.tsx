import React, { useEffect } from 'react';
import ReviewItem from '../../components/reviews-list/review-item';
import { useAppDispatch, useAppSelector } from '../../shared/redux-helpers/typed-hooks';
import { loadComments } from '../../slices/offer-page-slice/offer-page-slice';
import { Review } from '../../shared/entities/review/types';

interface CommentsListProps {
  offerId: string;
}

export const CommentsList: React.FC<CommentsListProps> = ({ offerId }) => {
  const dispatch = useAppDispatch();
  const comments = useAppSelector((state) => state.offerPage.comments);
  const isCommentsLoading = useAppSelector((state) => state.offerPage.isCommentsLoading);

  useEffect(() => {
    dispatch(loadComments(offerId));
  }, [dispatch, offerId]);

  if (isCommentsLoading) {
    return <div>Loading comments...</div>;
  }

  const sortedComments = [...comments]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return (
    <section className="offer__reviews reviews">
      <h2 className="reviews__title">
        Reviews · <span className="reviews__amount">{comments.length}</span>
      </h2>
      <ul className="reviews__list">
        {sortedComments.map((review: Review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </ul>
    </section>
  );
};
