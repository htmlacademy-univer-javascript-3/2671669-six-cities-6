import {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {CommentaryCard} from '../../components/commentary-card/commentary-card.tsx';
import {Spinner} from '../../components/spinner/spinner.tsx';
import {useAppDispatch, useAppSelector} from '../../shared/redux-helpers/typed-hooks.ts';
import {loadComments} from '../../slices/offer-page-slice/offer-page-slice.ts';

export const CommentsList = () => {
  const dispatch = useAppDispatch();
  const {id: offerId = ''} = useParams();
  const comments = useAppSelector((state) => state.offerPage.comments);
  const isLoading = useAppSelector((state) => state.offerPage.isCommentsLoading);

  useEffect(() => {
    dispatch(loadComments(offerId));
  }, [dispatch, offerId]);

  if (isLoading) {
    return <Spinner/>;
  }

  return (
    <>
      <h2 className="reviews__title">Reviews &middot; <span className="reviews__amount">{comments.length}</span></h2>
      <ul className="reviews__list">
        {comments.slice(0, 10).map((commentary) => (<CommentaryCard key={commentary.id} commentary={commentary}/>))}
      </ul>
    </>
  );
};
