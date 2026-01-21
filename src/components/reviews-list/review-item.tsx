import { format } from 'date-fns';
import { Review } from '../../shared/entities/review/types';

type ReviewItemProps = {
  review: Review;
};

function ReviewItem({ review }: ReviewItemProps) {
  const { comment, date, rating, user } = review;

  const formattedDate = format(new Date(date), 'MMMM yyyy');

  return (
    <li className="reviews__item">
      <div className="reviews__user user">
        <div className="reviews__avatar-wrapper user__avatar-wrapper">
          <img
            className="reviews__avatar user__avatar"
            src={user.avatarUrl}
            width="54"
            height="54"
            alt="Reviews avatar"
          />
        </div>
        <span className="reviews__user-name">{user.name}</span>
        {user.isPro && (
          <span className="reviews__user-status">Pro</span>
        )}
      </div>
      <div className="reviews__info">
        <div className="reviews__rating rating">
          <div className="reviews__stars rating__stars">
            <span style={{ width: `${rating * 20}%` }}></span>
          </div>
        </div>
        <p className="reviews__text">{comment}</p>
        <time className="reviews__time" dateTime={date}>
          {formattedDate}
        </time>
      </div>
    </li>
  );
}

export default ReviewItem;
