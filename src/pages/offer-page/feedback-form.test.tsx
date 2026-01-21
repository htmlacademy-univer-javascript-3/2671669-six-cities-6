import {configureMockStore} from '@jedmao/redux-mock-store';
import {Store} from '@reduxjs/toolkit';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Provider} from 'react-redux';
import {ReducerName} from '../../shared/enums/reducer-names.ts';
import {RequestStatus} from '../../shared/server/request-status.ts';
import {addComment, handleCommentPostingResult, resetCommentPostingState} from '../../slices/offer-page-slice/offer-page-slice.ts';
import {FeedbackForm} from './feedback-form'; // Проверь путь

vi.mock('../../slices/offer-page-slice/offer-page-slice.ts', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  addComment: vi.fn((payload) => ({type: 'offer/addComment', payload})),
  resetCommentPostingState: vi.fn(() => ({type: 'offer/resetCommentPostingState'})),
  handleCommentPostingResult: vi.fn(() => ({type: 'offer/handleCommentPostingResult'})),
}));

vi.mock('../../shared/entities/error/utils.ts', () => ({
  isValidationError: vi.fn(() => false),
}));

const mockStore = configureMockStore();
const MOCK_OFFER_ID = 'offer-123';

describe('Component: FeedbackForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderComponent = (store: any) => {
    return render(
      <Provider store={store as Store}>
        <FeedbackForm offerId={MOCK_OFFER_ID}/>
      </Provider>
    );
  };

  it('should render correctly and dispatch reset action on mount', () => {
    const store = mockStore({
      [ReducerName.offerPage]: {
        commentPostingState: RequestStatus.idle,
        commentPostingError: null,
      },
    });

    renderComponent(store);

    expect(screen.getByLabelText(/Your review/i)).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /Submit/i})).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Tell how was your stay/i)).toBeInTheDocument();

    expect(screen.getByRole('button', {name: /Submit/i})).toBeDisabled();

    expect(resetCommentPostingState).toHaveBeenCalledTimes(1);
  });

  it('should enable submit button only when form is valid', async () => {
    const user = userEvent.setup();
    const store = mockStore({
      [ReducerName.offerPage]: {
        commentPostingState: RequestStatus.idle,
        commentPostingError: null,
      },
    });

    renderComponent(store);

    const submitBtn = screen.getByRole('button', {name: /Submit/i});
    const textArea = screen.getByPlaceholderText(/Tell how was your stay/i);
    const starRating = screen.getByTitle('perfect');

    const validText = 'a'.repeat(60);
    await user.type(textArea, validText);
    expect(submitBtn).toBeDisabled();

    await user.click(starRating);
    expect(submitBtn).toBeEnabled();

    await user.clear(textArea);
    await user.type(textArea, 'short');
    expect(submitBtn).toBeDisabled();
  });

  it('should dispatch addComment with correct payload on submit', async () => {
    const user = userEvent.setup();
    const store = mockStore({
      [ReducerName.offerPage]: {
        commentPostingState: RequestStatus.idle,
      },
    });

    renderComponent(store);

    const starRating = screen.getByTitle('good'); // 4 звезды (value 4)
    const textArea = screen.getByPlaceholderText(/Tell how was your stay/i);
    const submitBtn = screen.getByRole('button', {name: /Submit/i});

    await user.click(starRating);
    const commentText = 'This is a test comment that is definitely longer than fifty characters required for validation.';
    await user.type(textArea, commentText);

    await user.click(submitBtn);

    expect(addComment).toHaveBeenCalledTimes(1);
    expect(addComment).toHaveBeenCalledWith({
      offerId: MOCK_OFFER_ID,
      comment: commentText,
      rating: 4,
    });
  });

  it('should block the form (inert) when status is pending', () => {
    const store = mockStore({
      [ReducerName.offerPage]: {
        commentPostingState: RequestStatus.pending,
      },
    });

    const {container} = renderComponent(store);

    const form = container.querySelector('form');
    expect(form).toHaveAttribute('data-inert', '');

    expect(screen.getByRole('button', {name: /Submit/i})).toBeDisabled();
  });

  it('should dispatch handleCommentPostingResult when status changes to success', () => {
    const store = mockStore({
      offerPage: {
        commentPostingState: RequestStatus.success,
      },
    });

    renderComponent(store);

    expect(handleCommentPostingResult).toHaveBeenCalled();
    expect(screen.getByPlaceholderText(/Tell how was your stay/i)).toHaveValue('');
  });

  it('should render error message if postingError exists', () => {
    const errorMessage = 'Something went wrong';
    const store = mockStore({
      offerPage: {
        commentPostingState: RequestStatus.failure,
        commentPostingError: {message: errorMessage},
      },
    });

    renderComponent(store);

    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
  });
});
