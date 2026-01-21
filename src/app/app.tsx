import {FC} from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import PrivateRoute from '../components/private-route/private-route.tsx';
import {FavoritesPage} from '../pages/favorites-page/favorites-page.tsx';
import LoginPage from '../pages/login-page/login-page.tsx';
import {MainPage} from '../pages/main-page/main-page.tsx';
import NotFound404Page from '../pages/not-found-404-page/not-found-404-page.tsx';
import {OfferPage} from '../pages/offer-page/offer-page.tsx';
import {PropertyPage} from '../pages/property-page/property-page.tsx';
import {RoutePath} from '../shared/enums/routes.ts';


export const App: FC = () => (
  <BrowserRouter>
    <Routes>
      <Route index element={<MainPage/>}/>
      <Route path={RoutePath.LoginPage} element={<LoginPage/>}/>
      <Route path={RoutePath.FavoritesPage} element={<PrivateRoute isAuthorized/>}>
        <Route path="" element={<FavoritesPage/>}/>
      </Route>
      <Route path={RoutePath.OfferPage} element={<OfferPage/>}>
        <Route path=":id" element={<OfferPage/>}/>
      </Route>
      <Route path={RoutePath.PropertyPage} element={<PropertyPage/>}/>
      <Route path="*" element={<NotFound404Page/>}/>
    </Routes>
  </BrowserRouter>
);
