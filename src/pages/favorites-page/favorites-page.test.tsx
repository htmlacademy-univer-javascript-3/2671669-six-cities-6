import {configureMockStore} from '@jedmao/redux-mock-store';
import {render, screen} from '@testing-library/react';
import {Provider} from 'react-redux';
import {MemoryRouter} from 'react-router-dom';
import {loadFavorites} from '../../slices/favorites-page-slice/favorites-page-slice';
import {FavoritesPage} from './favorites-page.tsx';

vi.mock('../../components/shared/header-logo-link/header-logo-link.tsx', () => ({
  HeaderLogoLink: () => <div data-testid="header-logo-link"/>
}));

vi.mock('../../components/shared/header-user-info/header-user-info.tsx', () => ({
  HeaderUserInfo: () => <div data-testid="header-user-info"/>
}));

vi.mock('./favorites-empty.tsx', () => ({
  FavoritesEmpty: () => <div data-testid="favorites-empty"/>
}));

vi.mock('./favorite-offer-card-list/favorite-offer-card-list.tsx', () => ({
  FavoriteOfferCardList: () => <div data-testid="favorite-offer-card-list"/>
}));

vi.mock('../../slices/favorites-page-slice/favorites-page-slice.ts', () => ({
  loadFavorites: vi.fn(() => ({type: 'favorites/load'}))
}));

const mockStore = configureMockStore();

describe('Component: FavoritesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly with empty favorites list', () => {
    const store = mockStore({
      favoritesPage: {
        favorites: [],
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoritesPage/>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('header-logo-link')).toBeInTheDocument();
    expect(screen.getByTestId('header-user-info')).toBeInTheDocument();
    expect(screen.getByTestId('favorites-empty')).toBeInTheDocument();
    expect(screen.queryByTestId('favorite-offer-card-list')).not.toBeInTheDocument();

    expect(screen.getByAltText(/6 cities logo/i)).toBeInTheDocument();
  });

  it('should render correctly with offers in favorites list', () => {
    const mockOffers = [{id: '1', title: 'Test Offer'}];
    const store = mockStore({
      favoritesPage: {
        favorites: mockOffers,
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoritesPage/>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('header-logo-link')).toBeInTheDocument();
    expect(screen.getByTestId('favorite-offer-card-list')).toBeInTheDocument();
    expect(screen.queryByTestId('favorites-empty')).not.toBeInTheDocument();

    expect(screen.getByText(/Saved listing/i)).toBeInTheDocument();
  });

  it('should dispatch loadFavorites action on mount', () => {
    const store = mockStore({
      favoritesPage: {
        favorites: [],
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoritesPage/>
        </MemoryRouter>
      </Provider>
    );

    const actions = store.getActions();
    expect(actions).toEqual([expect.objectContaining({type: 'favorites/load'})]);
    expect(loadFavorites).toHaveBeenCalledTimes(1);
  });
});
