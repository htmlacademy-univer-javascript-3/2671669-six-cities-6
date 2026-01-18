import { Review } from '../../mocks';
import ReviewItem from '../reviews-list/review-item';

interface ReviewsListProps {
  reviews: Review[];
}

function ReviewsList({ reviews }: ReviewsListProps) {
  return (
    <section className="offer__reviews reviews">
      <h2 className="reviews__title">
        Reviews · <span className="reviews__amount">{reviews.length}</span>
      </h2>
      <ul className="reviews__list">
        {reviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </ul>
    </section>
  );
}

export default ReviewsList;
