import React, {FC} from 'react';
import {NavLink} from 'react-router-dom';
import {RoutePath} from '../../../shared/enums/routes.ts';

export const HeaderLogoLink: FC = React.memo(() => {
  return (
    <NavLink className="header__logo-link" to={'/' + RoutePath.MainPage}>
      <img className="header__logo" src="img/logo.svg" alt="6 cities logo" width="81" height="41"/>
    </NavLink>
  );
});

HeaderLogoLink.displayName = 'HeaderLogoLink';

