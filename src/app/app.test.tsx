import {DeepPartial} from '@reduxjs/toolkit';
import {render, screen} from '@testing-library/react';
import React from 'react';
import {Provider} from 'react-redux';
import {MemoryRouter} from 'react-router-dom';
import {vi} from 'vitest';
import {useAuthToken} from '../hooks/use-auth-token/use-auth-token.ts';
import {UserData} from '../shared/entities/user/types.ts';
import {ReducerName} from '../shared/enums/reducer-names.ts';
import {RoutePath} from '../shared/enums/routes.ts';
import {RootState} from '../shared/redux-helpers/typed-hooks.ts';
import {App} from './app.tsx';
import {createStore} from './store.ts';

describe('App Routing', () => {
  vi.mock('../hooks/use-auth-token/use-auth-token.ts');

  vi.mock('../pages/main-page/main-page.tsx', () => ({MainPage: () => <div data-testid="MainPage"/>}));
  vi.mock('../pages/login-page/login-page.tsx', () => ({LoginPage: () => <div data-testid="LoginPage"/>}));
  vi.mock('../pages/favorites-page/favorites-page.tsx', () => ({FavoritesPage: () => <div data-testid="FavoritesPage"/>}));
  vi.mock('../pages/offer-page/offer-page.tsx', () => ({OfferPage: () => <div data-testid="OfferPage"/>}));
  vi.mock('../pages/not-found-404-page/not-found-404-page.tsx', () => ({NotFound404Page: () => <div data-testid="NotFoundPage"/>}));

  vi.mock('../components/spinner/full-space-spinner.tsx', () => ({
    FullSpaceSpinner: () => <div data-testid="FullSpaceSpinner"/>
  }));

  vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
      ...actual,
      BrowserRouter: ({children}: {children: React.ReactNode}) => <div>{children}</div>,
    };
  });

  const mockUseAuthToken = vi.mocked(useAuthToken);

  beforeEach(() => {
    mockUseAuthToken.mockReturnValue(true);
  });

  const renderWithRouter = (
    component: React.ReactNode,
    initialPath: string = '/',
    initialState: DeepPartial<RootState> = {},
  ) => {
    return render(
      <Provider store={createStore({initialState: initialState as Partial<RootState>})}>
        <MemoryRouter initialEntries={[initialPath]}>
          {component}
        </MemoryRouter>
      </Provider>
    );
  };

  it('should render FullSpaceSpinner if auth token is not checked yet', () => {
    mockUseAuthToken.mockReturnValue(false);

    renderWithRouter(<App/>, '/');

    expect(screen.getByTestId('FullSpaceSpinner')).toBeInTheDocument();
    expect(screen.queryByTestId('MainPage')).not.toBeInTheDocument();
  });

  it('should render MainPage on root path when auth is checked', () => {
    renderWithRouter(<App/>, '/');
    expect(screen.getByTestId('MainPage')).toBeInTheDocument();
  });

  it('should render NotFoundPage on invalid route', () => {
    renderWithRouter(<App/>, '/abracadabra-path');
    expect(screen.getByTestId('NotFoundPage')).toBeInTheDocument();
  });

  it('should render LoginPage', () => {
    renderWithRouter(<App/>, '/' + RoutePath.LoginPage);
    expect(screen.getByTestId('LoginPage')).toBeInTheDocument();
  });

  it('should render OfferPage with dynamic ID', () => {
    renderWithRouter(<App/>, `/${RoutePath.OfferPage}/1`);
    expect(screen.getByTestId('OfferPage')).toBeInTheDocument();
  });

  it('should render FavoritesPage if user data exists', () => {
    renderWithRouter(<App/>, '/' + RoutePath.FavoritesPage, {[ReducerName.currentUser]: {userData: {} as UserData}});
    expect(screen.getByTestId('FavoritesPage')).toBeInTheDocument();
  });

  it('should redirect to LoginPage if user data not exists', () => {
    renderWithRouter(<App/>, '/' + RoutePath.FavoritesPage, {[ReducerName.currentUser]: {userData: null}});
    expect(screen.getByTestId('LoginPage')).toBeInTheDocument();
  });
});
