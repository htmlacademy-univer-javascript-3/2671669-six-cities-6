import {configureMockStore} from '@jedmao/redux-mock-store';
import {fireEvent, render, screen} from '@testing-library/react';
import {Provider} from 'react-redux';
import {userLogin} from '../../slices/current-user-slice/current-user-slice';
import {LoginForm} from './login-form.tsx';

vi.mock('../../slices/current-user-slice/current-user-slice', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  userLogin: vi.fn((payload) => ({type: 'user/login', payload})),
}));

const mockStore = configureMockStore([]);

describe('Component: LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render inputs and submit button correctly', () => {
    const store = mockStore({
      currentUser: {authorizationError: null},
    });

    render(
      <Provider store={store}>
        <LoginForm/>
      </Provider>
    );

    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();

    expect(screen.getByRole('button', {name: /Sign in/i})).toBeInTheDocument();

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  it('should dispatch "userLogin" action with typed values on submit', () => {
    const store = mockStore({
      currentUser: {authorizationError: null},
    });

    render(
      <Provider store={store}>
        <LoginForm/>
      </Provider>
    );

    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const form = screen.getByRole('button', {name: /Sign in/i}).closest('form');

    fireEvent.change(emailInput, {target: {value: 'test@test.com'}});
    fireEvent.change(passwordInput, {target: {value: '123456'}});

    if (form) {
      fireEvent.submit(form);
    }

    expect(userLogin).toHaveBeenCalledTimes(1);
    expect(userLogin).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: '123456',
    });
  });

  it('should display error message when "authorizationError" is present in state', () => {
    const errorMessage = 'Invalid email or password';
    const store = mockStore({
      currentUser: {authorizationError: errorMessage},
    });

    render(
      <Provider store={store}>
        <LoginForm/>
      </Provider>
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
