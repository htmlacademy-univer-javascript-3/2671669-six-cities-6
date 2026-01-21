import {configureMockStore} from '@jedmao/redux-mock-store';
import {Store} from '@reduxjs/toolkit';
import {render, screen} from '@testing-library/react';
import {Provider} from 'react-redux';
import {MemoryRouter, Route, Routes} from 'react-router-dom';
import {loadComments} from '../../slices/offer-page-slice/offer-page-slice';
import {CommentsList} from './comments-list';

vi.mock('../../components/commentary-card/commentary-card.tsx', () => ({
  CommentaryCard: () => <li data-testid="commentary-card"/>
}));

vi.mock('../../components/spinner/spinner.tsx', () => ({
  Spinner: () => <div data-testid="spinner"/>
}));

vi.mock('../../slices/offer-page-slice/offer-page-slice.ts', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  loadComments: vi.fn((id) => ({type: 'offer/loadComments', payload: id}))
}));

const mockStore = configureMockStore();
const MOCK_OFFER_ID = '123';

const makeFakeComments = (count: number) =>
  new Array(count).fill(null).map((_, i) => ({id: String(i), text: `Comment ${i}`}));

describe('Component: CommentsList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderComponent = (store: any) => {
    return render(
      <Provider store={store as Store}>
        <MemoryRouter initialEntries={[`/offer/${MOCK_OFFER_ID}`]}>
          <Routes>
            <Route path="/offer/:id" element={<CommentsList/>}/>
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  };

  it('should render Spinner when data is loading', () => {
    const store = mockStore({
      offerPage: {
        comments: [],
        isCommentsLoading: true, // Имитируем загрузку
      },
    });

    renderComponent(store);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.queryByText(/Reviews/i)).not.toBeInTheDocument();
  });

  it('should dispatch loadComments with correct ID on mount', () => {
    const store = mockStore({
      offerPage: {
        comments: [],
        isCommentsLoading: false,
      },
    });

    renderComponent(store);

    expect(loadComments).toHaveBeenCalledTimes(1);
    expect(loadComments).toHaveBeenCalledWith(MOCK_OFFER_ID);

    const actions = store.getActions();
    expect(actions[0].type).toBe('offer/loadComments');
    expect(actions[0].payload).toBe(MOCK_OFFER_ID);
  });

  it('should render list of comments correctly', () => {
    const fakeComments = makeFakeComments(3); // 3 комментария
    const store = mockStore({
      offerPage: {
        comments: fakeComments,
        isCommentsLoading: false,
      },
    });

    renderComponent(store);

    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    expect(screen.getByText(/Reviews/i)).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();

    expect(screen.getAllByTestId('commentary-card')).toHaveLength(3);
  });

  it('should render only first 10 comments (limit logic)', () => {
    const fakeComments = makeFakeComments(15); // Генерируем 15 комментариев
    const store = mockStore({
      offerPage: {
        comments: fakeComments,
        isCommentsLoading: false,
      },
    });

    renderComponent(store);

    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getAllByTestId('commentary-card')).toHaveLength(10);
  });
});
