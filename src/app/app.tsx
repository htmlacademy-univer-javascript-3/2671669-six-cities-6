import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from '../components/private-route/private-route';
import FavoritesPage from '../pages/favorites-page/favorites-page';
import LoginPage from '../pages/login-page/login-page';
import MainPage from '../pages/main-page/main-page';
import NotFound404Page from '../pages/not-found-404-page/not-found-404-page';
import OfferPage from '../pages/offer-page/offer-page';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Главная страница */}
        <Route path="/" element={<MainPage />} />

        {/* Страница логина */}
        <Route path="/login" element={<LoginPage />} />

        {/* Защищенная страница избранного */}
        <Route
          path="/favorites"
          element={
            <PrivateRoute>
              <FavoritesPage />
            </PrivateRoute>
          }
        />

        {/* Страница предложения */}
        <Route path="/offer/:id" element={<OfferPage />} />

        {/* 404 - несуществующий маршрут */}
        <Route path="*" element={<NotFound404Page />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
