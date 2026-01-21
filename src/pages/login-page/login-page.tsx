import {FC} from 'react';
import {Navigate, NavLink} from 'react-router-dom';
import {HeaderLogoLink} from '../../components/shared/header-logo-link/header-logo-link.tsx';
import {cities, CITY_SEARCH_PARAM} from '../../shared/entities/city/constants.ts';
import {RoutePath} from '../../shared/enums/routes.ts';
import {useAppSelector} from '../../shared/redux-helpers/typed-hooks.ts';
import {getRandomInt} from '../../shared/utils/math-utils.ts';
import {LoginForm} from './login-form.tsx';

export const LoginPage: FC = () => {
  const isAuthorize = useAppSelector((state) => !!state.currentUser.userData);

  if (isAuthorize) {
    return <Navigate to={'/' + RoutePath.MainPage}/>;
  }

  const city = cities[getRandomInt(0, cities.length - 1)];

  return (
    <div className="page page--gray page--login">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <HeaderLogoLink/>
            </div>
          </div>
        </div>
      </header>

      <main className="page__main page__main--login">
        <div className="page__login-container container">
          <section className="login">
            <h1 className="login__title">Sign in</h1>
            <LoginForm/>
          </section>
          <section className="locations locations--login locations--current">
            <div className="locations__item">
              <NavLink
                className="locations__item-link"
                to={{
                  pathname: '/' + RoutePath.MainPage,
                  search: `?${CITY_SEARCH_PARAM}=${city}`,
                }}
              >
                <span>{city}</span>
              </NavLink>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
