import ReviewItem from './review-item';
import { Review } from '../../shared/entities/review/types';

type ReviewListProps = {
  reviews: Review[];
};

function ReviewList({ reviews }: ReviewListProps) {
  return (
    <ul className="reviews__list">
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </ul>
  );
}

export default ReviewList;
