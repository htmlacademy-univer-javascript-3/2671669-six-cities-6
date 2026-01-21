import React from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../shared/redux-helpers/typed-hooks';
import { logout } from '../../../slices/current-user-slice/current-user-slice';
import { RoutePath } from '../../../shared/enums/routes';

export const HeaderUserInfo: React.FC = () => {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.currentUser.userData);
  const isAuthorized = !!userData;

  const handleLogout = (): void => {
    dispatch(logout());
  };

  return (
    <nav className="header__nav">
      <ul className="header__nav-list">
        {isAuthorized ? (
          <>
            <li className="header__nav-item user">
              <Link className="header__nav-link header__nav-link--profile" to={`/${RoutePath.FavoritesPage}`}>
                <div className="header__avatar-wrapper user__avatar-wrapper"></div>
                <span className="header__user-name user__name">{userData?.email}</span>
              </Link>
            </li>
            <li className="header__nav-item">
              <button
                className="header__nav-link"
                onClick={handleLogout}
                type="button"
              >
                <span className="header__signout">Sign out</span>
              </button>
            </li>
          </>
        ) : (
          <li className="header__nav-item user">
            <Link className="header__nav-link header__nav-link--profile" to={`/${RoutePath.LoginPage}`}>
              <div className="header__avatar-wrapper user__avatar-wrapper"></div>
              <span className="header__login">Sign in</span>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};
