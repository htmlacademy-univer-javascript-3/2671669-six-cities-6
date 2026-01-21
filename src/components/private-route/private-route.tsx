import {FC} from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import {RoutePath} from '../../shared/enums/routes.ts';
import {useAppSelector} from '../../shared/redux-helpers/typed-hooks.ts';

export const PrivateRoute: FC = () => {
  const isAuthorized = useAppSelector((state) => !!state.currentUser.userData);
  return isAuthorized ? <Outlet/> : <Navigate to={'/' + RoutePath.LoginPage}/>;
};

