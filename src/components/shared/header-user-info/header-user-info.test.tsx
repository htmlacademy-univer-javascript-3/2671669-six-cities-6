import {configureMockStore} from '@jedmao/redux-mock-store';
import {Store} from '@reduxjs/toolkit';
import {fireEvent, render, screen} from '@testing-library/react';
import {Provider} from 'react-redux';
import {MemoryRouter} from 'react-router-dom';
import {UserData} from '../../../shared/entities/user/types.ts';
import {ReducerName} from '../../../shared/enums/reducer-names.ts';
import {RootState} from '../../../shared/redux-helpers/typed-hooks.ts';
import {userLogout} from '../../../slices/current-user-slice/current-user-slice';
import {HeaderUserInfo} from './header-user-info.tsx';

describe('Component: HeaderUserInfo', () => {
  vi.mock('../../../slices/current-user-slice/current-user-slice', () => ({
    userLogout: vi.fn(() => ({type: 'user/logout'})),
  }));

  const mockStore = configureMockStore<RootState>([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderComponent = (store: any) => {
    return render(
      <Provider store={store as Store}>
        <MemoryRouter>
          <HeaderUserInfo/>
        </MemoryRouter>
      </Provider>
    );
  };

  it('should render "Sign in" when user is NOT logged in', () => {
    const store = mockStore({
      currentUser: {userData: null},
      offers: {favoriteOffersCount: 0},
    });

    renderComponent(store);

    expect(screen.getByText(/Sign in/i)).toBeInTheDocument();

    // 4. Проверяем отсутствие элементов авторизованного пользователя
    expect(screen.queryByText(/Sign out/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('should render user info and "Sign out" when user IS logged in', () => {
    // 1. Подготавливаем стейт для авторизованного юзера
    const fakeUser = {
      name: 'Oliver',
      avatarUrl: 'https://test.com/avatar.jpg',
    } as UserData;
    const favoriteCount = 5;

    const store = mockStore({
      [ReducerName.currentUser]: {userData: fakeUser},
      [ReducerName.offers]: {favoriteOffersCount: favoriteCount},
    });

    renderComponent(store);

    expect(screen.getByText(/Sign out/i)).toBeInTheDocument();
    expect(screen.getByText(fakeUser.name)).toBeInTheDocument();
    expect(screen.getByText(favoriteCount.toString())).toBeInTheDocument(); // Проверяем счетчик

    const avatar = screen.getByRole('img');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', fakeUser.avatarUrl);

    expect(screen.queryByText(/Sign in/i)).not.toBeInTheDocument();
  });

  it('should dispatch "userLogout" action when "Sign out" is clicked', () => {
    const store = mockStore({
      [ReducerName.currentUser]: {userData: {name: 'Test', avatarUrl: ''} as UserData},
      [ReducerName.offers]: {favoriteOffersCount: 0},
    });

    renderComponent(store);

    const signOutButton = screen.getByText(/Sign out/i);
    fireEvent.click(signOutButton);

    const actions = store.getActions();

    expect(userLogout).toHaveBeenCalled();
    expect(actions).toEqual([{type: 'user/logout'}]);
  });
});
