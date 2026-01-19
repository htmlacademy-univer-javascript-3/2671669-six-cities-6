import { Link } from 'react-router-dom';
import { Offer } from '../../shared/entities/offer/types';
import OfferCard from '../../components/offer-card-list/offer-card';

interface FavoritesPageProps {
  offers: Offer[];
}

function FavoritesPage({ offers }: FavoritesPageProps) {
  const favoritesByCity: Record<string, Offer[]> = {};

  offers.forEach((offer) => {
    if (!favoritesByCity[offer.city]) {
      favoritesByCity[offer.city] = [];
    }
    favoritesByCity[offer.city].push(offer);
  });

  return (
    <div className="page">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Link to="/" className="header__logo-link">
                <img className="header__logo" src="img/logo.svg" alt="6 cities logo" width="81" height="41" />
              </Link>
            </div>
            <nav className="header__nav">
              <ul className="header__nav-list">
                <li className="header__nav-item user">
                  <Link to="/favorites" className="header__nav-link header__nav-link--profile">
                    <div className="header__avatar-wrapper user__avatar-wrapper"></div>
                    <span className="header__user-name user__name">Oliver.conner@gmail.com</span>
                  </Link>
                </li>
                <li className="header__nav-item">
                  <Link to="/" className="header__nav-link">
                    <span className="header__signout">Sign out</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="page__main page__main--favorites">
        <div className="page__favorites-container container">
          <section className="favorites">
            <h1 className="favorites__title">Saved listing</h1>
            {Object.keys(favoritesByCity).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <p>No favorites yet</p>
                <Link to="/">Go to main page</Link>
              </div>
            ) : (
              <ul className="favorites__list">
                {Object.entries(favoritesByCity).map(([city, cityOffers]) => (
                  <li key={city} className="favorites__locations-items">
                    <div className="favorites__locations locations locations--current">
                      <div className="locations__item">
                        <Link className="locations__item-link" to={`/?city=${city}`}>
                          <span>{city}</span>
                        </Link>
                      </div>
                    </div>
                    <div className="favorites__places">
                      {cityOffers.map((offer) => (
                        <OfferCard key={offer.id} offer={offer} />
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default FavoritesPage;
