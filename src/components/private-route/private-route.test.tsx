import {DeepPartial} from '@reduxjs/toolkit';
import {render, screen} from '@testing-library/react';
import React from 'react';
import {Provider} from 'react-redux';
import {MemoryRouter, Route, Routes} from 'react-router-dom';
import {createStore} from '../../app/store.ts';
import {UserData} from '../../shared/entities/user/types.ts';
import {ReducerName} from '../../shared/enums/reducer-names.ts';
import {RoutePath} from '../../shared/enums/routes.ts';
import {RootState} from '../../shared/redux-helpers/typed-hooks.ts';
import {PrivateRoute} from './private-route.tsx';

describe('Component: PrivateRoute', () => {

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

  const MockLoginPage = () => <div data-testid="login-page">Login Page</div>;
  const MockSecretPage = () => <div data-testid="protected-content">Secret Page</div>;

  const TestRouting = () => (
    <Routes>
      <Route path={RoutePath.LoginPage} element={<MockLoginPage/>}/>
      <Route element={<PrivateRoute/>}>
        <Route path="/protected" element={<MockSecretPage/>}/>
      </Route>
    </Routes>
  );

  it('should redirect unauthorized user to Login page', () => {
    renderWithRouter(<TestRouting/>, '/protected', {[ReducerName.currentUser]: {userData: null}});
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('should render protected content for auth user', () => {
    renderWithRouter(<TestRouting/>, '/protected', {[ReducerName.currentUser]: {userData: {} as UserData}});
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
  });
});
