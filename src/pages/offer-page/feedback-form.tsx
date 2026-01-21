import {FC, FormEventHandler, Fragment, useEffect, useState} from 'react';
import {isValidationError} from '../../shared/entities/error/utils.ts';
import {Offer} from '../../shared/entities/offer/types.ts';
import {useAppDispatch, useAppSelector} from '../../shared/redux-helpers/typed-hooks.ts';
import {RequestStatus} from '../../shared/server/request-status.ts';
import {addComment, handleCommentPostingResult, resetCommentPostingState} from '../../slices/offer-page-slice/offer-page-slice.ts';

type FeedbackFormProps = {
  offerId: Offer['id'];
};

const starTitles = [undefined, 'terribly', 'badly', 'not bad', 'good', 'perfect'] as const;

const MIN_COMMENTARY_LENGTH = 50;
const MAX_COMMENTARY_LENGTH = 300;

export const FeedbackForm: FC<FeedbackFormProps> = ({offerId}) => {
  const dispatch = useAppDispatch();
  const postingState = useAppSelector((state) => state.offerPage.commentPostingState);
  const postingError = useAppSelector((state) => state.offerPage.commentPostingError);

  const [rating, setRating] = useState(0);
  const [comment, setCommentText] = useState('');

  const isSubmitDisabled = rating === 0
    || comment.length < MIN_COMMENTARY_LENGTH
    || comment.length > MAX_COMMENTARY_LENGTH
    || postingState !== RequestStatus.idle;

  const handleStarClick: FormEventHandler<HTMLInputElement> = (e) => {
    setRating(parseInt((e.target as HTMLInputElement).value, 10));
  };

  const handleReviewInput: FormEventHandler<HTMLTextAreaElement> = (e) => {
    setCommentText((e.target as HTMLTextAreaElement).value);
  };

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    dispatch(addComment({offerId, comment, rating}));
  };

  useEffect(() => {
    dispatch(resetCommentPostingState());
  }, [dispatch]);

  useEffect(() => {
    let isMounted = true;

    if (isMounted && postingState === RequestStatus.success) {
      setCommentText('');
      setRating(0);
    }
    if (postingState === RequestStatus.success || postingState === RequestStatus.failure) {
      dispatch(handleCommentPostingResult());
    }

    return () => {
      isMounted = false;
    };
  }, [dispatch, postingState, setRating, setCommentText]);

  return (
    <form
      className="reviews__form form"
      onSubmit={handleFormSubmit}
      data-inert={postingState === RequestStatus.pending ? '' : undefined}
    >
      <label className="reviews__label form__label" htmlFor="review">Your review</label>
      <div className="reviews__rating-form form__rating">
        {[5, 4, 3, 2, 1].map((starCount) => (
          <Fragment key={starCount}>
            <input
              type="radio"
              name="rating"
              id={`${starCount}-stars`}
              value={starCount}
              checked={starCount === rating}
              className="form__rating-input visually-hidden"
              onChange={handleStarClick}
            />
            <label
              htmlFor={`${starCount}-stars`}
              className="reviews__rating-label form__rating-label"
              title={starTitles[starCount]}
            >
              <svg className="form__star-image" width="37" height="33">
                <use xlinkHref="#icon-star"></use>
              </svg>
            </label>
          </Fragment>
        ))}
      </div>
      <textarea
        id="review"
        name="review"
        className="reviews__textarea form__textarea"
        placeholder="Tell how was your stay, what you like and what can be improved"
        onInput={handleReviewInput}
        value={comment}
      >
      </textarea>
      <div className="reviews__button-wrapper">
        <p className="reviews__help">
          To submit review please make sure to set <span className="reviews__star">rating</span> and describe your stay with at least <b className="reviews__text-amount">50 characters</b>.
        </p>
        <button
          className="reviews__submit form__submit button"
          type="submit"
          disabled={isSubmitDisabled}
        >
          Submit
        </button>
      </div>
      {postingError && (
        <p style={{color: 'red'}}>
          Error:{' '}
          {
            isValidationError(postingError)
              ? (postingError.details[0]?.messages[0] ?? postingError.message)
              : postingError.message
          }
        </p>
      )}
    </form>
  );
};
