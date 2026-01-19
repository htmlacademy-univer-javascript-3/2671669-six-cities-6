import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from '../components/private-route/private-route';
import FavoritesPage from '../pages/favorites-page/favorites-page';
import LoginPage from '../pages/login-page/login-page';
import MainPage from '../pages/main-page/main-page';
import NotFound404Page from '../pages/not-found-404-page/not-found-404-page';
import OfferPage from '../pages/offer-page/offer-page';
import { Offer} from '../shared/entities/offer/types';
import { Review } from '../mocks/reviews';


interface AppProps {
  offers: Offer[];
  reviews: Review[];
}

function App({ offers, reviews }: AppProps) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage offers={offers} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/favorites"
          element={
            <PrivateRoute>
              <FavoritesPage offers={offers.filter((offer) => offer.isFavorite)} />
            </PrivateRoute>
          }
        />
        <Route path="/offer/:id" element={<OfferPage offers={offers} reviews={reviews} />} />
        <Route path="*" element={<NotFound404Page />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
