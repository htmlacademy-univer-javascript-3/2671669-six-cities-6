import {configureMockStore} from '@jedmao/redux-mock-store';
import {render, screen} from '@testing-library/react';
import {Provider} from 'react-redux';
import {MemoryRouter, Route, Routes} from 'react-router-dom';
import {cities, CITY_SEARCH_PARAM} from '../../shared/entities/city/constants.ts';
import {RoutePath} from '../../shared/enums/routes.ts';
import {LoginPage} from './login-page.tsx';

vi.mock('../../shared/utils/math-utils.ts', () => ({
  getRandomInt: () => 0,
}));

vi.mock('./login-form.tsx', () => ({
  LoginForm: () => <div data-testid="login-form-mock">Mock Login Form</div>,
}));

vi.mock('../../components/shared/header-logo-link/header-logo-link.tsx', () => ({
  HeaderLogoLink: () => <div>Logo Link</div>,
}));

const mockStore = configureMockStore([]);
const FIXED_CITY = cities[0];

describe('Page: LoginPage', () => {
  it('should redirect to Main Page if user is ALREADY authorized', () => {
    const store = mockStore({
      currentUser: {userData: {name: 'User'}},
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path={'/' + RoutePath.MainPage} element={<h1>Welcome to Main Page</h1>}/>
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Welcome to Main Page/i)).toBeInTheDocument();
    expect(screen.queryByText(/Sign in/i)).not.toBeInTheDocument();
  });

  it('should render login layout if user is NOT authorized', () => {
    const store = mockStore({
      currentUser: {userData: null},
      offers: {favoriteOffersCount: 0},
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage/>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole('heading', {level: 1, name: /Sign in/i})).toBeInTheDocument();

    expect(screen.getByTestId('login-form-mock')).toBeInTheDocument();

    expect(screen.getByText('Logo Link')).toBeInTheDocument();
  });

  it('should render a link to a random city (mocked to index 0)', () => {
    const store = mockStore({
      currentUser: {userData: null},
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage/>
        </MemoryRouter>
      </Provider>
    );

    const cityLink = screen.getByRole('link', {name: FIXED_CITY});

    expect(cityLink).toBeInTheDocument();

    const expectedPath = '/' + RoutePath.MainPage;
    const expectedSearch = `?${CITY_SEARCH_PARAM}=${FIXED_CITY}`;

    expect(cityLink).toHaveAttribute('href', expectedPath + expectedSearch);
  });
});
