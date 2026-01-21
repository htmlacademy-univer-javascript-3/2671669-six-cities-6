import {FC, FormEventHandler, useRef} from 'react';
import {useAppDispatch, useAppSelector} from '../../shared/redux-helpers/typed-hooks.ts';
import {userLogin} from '../../slices/current-user-slice/current-user-slice.ts';

export const LoginForm: FC = () => {
  const dispatch = useAppDispatch();
  const error = useAppSelector((state) => state.currentUser.authorizationError);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    dispatch(userLogin({
      email: emailRef.current?.value ?? '',
      password: passwordRef.current?.value ?? '',
    }));
  };

  return (
    <form className="login__form form" action="#" method="post" onSubmit={handleSubmit}>
      <div className="login__input-wrapper form__input-wrapper">
        <label className="visually-hidden">E-mail</label>
        <input
          className="login__input form__input"
          type="email"
          name="email"
          placeholder="Email"
          autoComplete="email"
          required
          ref={emailRef}
        />
      </div>
      <div className="login__input-wrapper form__input-wrapper">
        <label className="visually-hidden">Password</label>
        <input
          className="login__input form__input"
          type="password"
          name="password"
          placeholder="Password"
          autoComplete="current-password"
          required
          ref={passwordRef}
        />
      </div>
      {error && <div><p style={{color: 'red'}}>{error}</p></div>}
      <button className="login__submit form__submit button" type="submit">Sign in</button>
    </form>
  );
};
