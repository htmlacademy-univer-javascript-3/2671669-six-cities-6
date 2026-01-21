import React, {FC} from 'react';
import {NavLink} from 'react-router-dom';
import {RoutePath} from '../../../shared/enums/routes.ts';
import {useAppDispatch, useAppSelector} from '../../../shared/redux-helpers/typed-hooks.ts';
import {userLogout} from '../../../slices/current-user-slice/current-user-slice.ts';

export const HeaderUserInfo: FC = React.memo(() => {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.currentUser.userData);
  const favoriteOffersCount = useAppSelector((state) => state.offers.favoriteOffersCount);

  const handleLogout = () => {
    dispatch(userLogout());
  };

  return (
    <nav className="header__nav">
      <ul className="header__nav-list">
        {userData && (
          <li className="header__nav-item user">
            <NavLink className="header__nav-link header__nav-link--profile" to={'/' + RoutePath.FavoritesPage}>
              <div className="header__avatar-wrapper user__avatar-wrapper">
                <img src={userData.avatarUrl} alt="" style={{borderRadius: '50%'}}/>
              </div>
              <span className="header__user-name user__name">{userData.name}</span>
              <span className="header__favorite-count">{favoriteOffersCount}</span>
            </NavLink>
          </li>
        )}
        <li className="header__nav-item">
          {userData ? (
            <span className="header__nav-link" onClick={handleLogout} style={{cursor: 'pointer'}}>
              <span className="header__signout">Sign out</span>
            </span>
          ) : (
            <NavLink className="header__nav-link" to={'/' + RoutePath.LoginPage}>
              <span className="header__signout">Sign in</span>
            </NavLink>
          )}
        </li>
      </ul>
    </nav>
  );
});

HeaderUserInfo.displayName = 'HeaderUserInfo';
