import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Offer } from '../../shared/entities/offer/types';
import OffersList from '../../components/offer-card-list/offer-card-list';
import Map from '../../components/map/map'; // ✅ Импортируем компонент Map

interface MainPageProps {
  offers: Offer[];
}

function MainPage({ offers }: MainPageProps) {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const cityOffers = offers.filter((offer) => offer.city === 'Amsterdam');
  const offersCount = cityOffers.length;
  const favoriteCount = offers.filter((o) => o.isFavorite).length;

  const handleCardHover = (offerId: string | null) => {
    setActiveCardId(offerId);
  };

  const activeOffer = cityOffers.find((offer) => offer.id === activeCardId);

  return (
    <div className="page page--gray page--main">
      {/* ✅ Скрытый div с информацией об активной карточке */}
      <div style={{ display: 'none' }}>
        Active card ID: {activeCardId || 'none'}
        {activeOffer && ` - ${activeOffer.title}`}
      </div>

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
                    <span className="header__favorite-count">{favoriteCount}</span>
                  </Link>
                </li>
                <li className="header__nav-item">
                  <Link to="/login" className="header__nav-link">
                    <span className="header__signout">Sign out</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <section className="locations container">
            <ul className="locations__list tabs__list">
              <li className="locations__item">
                <a className="locations__item-link tabs__item" href="#">
                  <span>Paris</span>
                </a>
              </li>
              <li className="locations__item">
                <a className="locations__item-link tabs__item" href="#">
                  <span>Cologne</span>
                </a>
              </li>
              <li className="locations__item">
                <a className="locations__item-link tabs__item" href="#">
                  <span>Brussels</span>
                </a>
              </li>
              <li className="locations__item">
                <a className="locations__item-link tabs__item tabs__item--active" href="#">
                  <span>Amsterdam</span>
                </a>
              </li>
              <li className="locations__item">
                <a className="locations__item-link tabs__item" href="#">
                  <span>Hamburg</span>
                </a>
              </li>
              <li className="locations__item">
                <a className="locations__item-link tabs__item" href="#">
                  <span>Dusseldorf</span>
                </a>
              </li>
            </ul>
          </section>
        </div>
        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">{offersCount} places to stay in Amsterdam</b>
              <form className="places__sorting" action="#" method="get">
                <span className="places__sorting-caption">Sort by</span>
                <span className="places__sorting-type" tabIndex={0}>
                  Popular
                  <svg className="places__sorting-arrow" width="7" height="4">
                    <use xlinkHref="#icon-arrow-select"></use>
                  </svg>
                </span>
              </form>

              <OffersList offers={cityOffers} onCardHover={handleCardHover} />

            </section>
            <div className="cities__right-section">
              {/* ✅ Заменяем пустой контейнер на реальную карту */}
              <section className="cities__map map">
                <Map offers={cityOffers} activeCardId={activeCardId} />
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MainPage;

