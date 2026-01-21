import {NavLink} from 'react-router-dom';
import {RoutePath} from '../../shared/enums/routes.ts';

export const NotFound404Page = () => {
  return (
    <div className="page">
      <h1>404 Not Found :(</h1>
      <NavLink
        to={'/' + RoutePath.MainPage}
        className="locations__item-link tabs__item tabs__item--active"
      >
        На главную
      </NavLink>
    </div>
  );
};
