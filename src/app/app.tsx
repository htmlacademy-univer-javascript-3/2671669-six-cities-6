import {FC} from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {PrivateRoute} from '../components/private-route/private-route.tsx';
import {FullSpaceSpinner} from '../components/spinner/full-space-spinner.tsx';
import {useAuthToken} from '../hooks/use-auth-token/use-auth-token.ts';
import {FavoritesPage} from '../pages/favorites-page/favorites-page.tsx';
import {LoginPage} from '../pages/login-page/login-page.tsx';
import {MainPage} from '../pages/main-page/main-page.tsx';
import {NotFound404Page} from '../pages/not-found-404-page/not-found-404-page.tsx';
import {OfferPage} from '../pages/offer-page/offer-page.tsx';
import {RoutePath} from '../shared/enums/routes.ts';

export const App: FC = () => {
  const isAuthChecked = useAuthToken();

  if (!isAuthChecked) {
    return <FullSpaceSpinner/>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<MainPage/>}/>
        <Route path={RoutePath.LoginPage} element={<LoginPage/>}/>
        <Route path={RoutePath.FavoritesPage} element={<PrivateRoute/>}>
          <Route path="" element={<FavoritesPage/>}/>
        </Route>
        <Route path={RoutePath.OfferPage} element={<OfferPage/>}>
          <Route path=":id" element={<OfferPage/>}/>
        </Route>
        <Route path={RoutePath.Page404} element={<NotFound404Page/>}/>
        <Route path="*" element={<NotFound404Page/>}/>
      </Routes>
    </BrowserRouter>
  );
};
