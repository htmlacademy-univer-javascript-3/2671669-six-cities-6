import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Offer } from '../../shared/entities/offer/types';
import { CityName } from '../../shared/entities/city/types';
import Map from '../../components/map/map';

function MainPage() {
  const offers: Offer[] = [
    {
      id: '1',
      title: 'Beautiful & luxurious apartment at great location',
      type: 'Apartment',
      price: 120,
      city: CityName.Amsterdam,
      location: {
        latitude: 52.3909553943508,
        longitude: 4.85309666406198,
        zoom: 10,
      },
      rating: 4.8,
      previewImage: 'img/apartment-01.jpg',
      isPremium: true,
      isFavorite: false
    },
    {
      id: '2',
      title: 'Wood and stone place',
      type: 'Private room',
      price: 80,
      city: CityName.Amsterdam,
      location: {
        latitude: 52.3609553943508,
        longitude: 4.85309666406198,
        zoom: 10,
      },
      rating: 4.2,
      previewImage: 'img/room.jpg',
      isPremium: false,
      isFavorite: true
    },
    {
      id: '3',
      title: 'Canal View Prinsengracht',
      type: 'Apartment',
      price: 132,
      city: CityName.Amsterdam,
      location: {
        latitude: 52.3909553943508,
        longitude: 4.929309666406198,
        zoom: 10,
      },
      rating: 4.7,
      previewImage: 'img/apartment-02.jpg',
      isPremium: false,
      isFavorite: false
    },
    {
      id: '4',
      title: 'Nice, cozy, warm big bed apartment',
      type: 'Apartment',
      price: 180,
      city: CityName.Amsterdam,
      location: {
        latitude: 52.3809553943508,
        longitude: 4.939309666406198,
        zoom: 10,
      },
      rating: 5.0,
      previewImage: 'img/apartment-03.jpg',
      isPremium: true,
      isFavorite: false
    },
    {
      id: '5',
      title: 'Wood and stone place',
      type: 'Private room',
      price: 80,
      city: CityName.Paris,
      location: {
        latitude: 48.85661,
        longitude: 2.351499,
        zoom: 10,
      },
      rating: 4.2,
      previewImage: 'img/room.jpg',
      isPremium: false,
      isFavorite: false
    },
  ];

  const currentCity = CityName.Amsterdam;
  // Правильное сравнение enum: оба значения одного типа CityName
  const filteredOffers = offers.filter((offer) => offer.city === currentCity);
  const offersCount = filteredOffers.length;

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
                  <span>{CityName.Paris}</span>
                </a>
              </li>
              <li className="locations__item">
                <a className="locations__item-link tabs__item" href="#">
                  <span>{CityName.Cologne}</span>
                </a>
              </li>
              <li className="locations__item">
                <a className="locations__item-link tabs__item" href="#">
                  <span>{CityName.Brussels}</span>
                </a>
              </li>
              <li className="locations__item">
                <a className="locations__item-link tabs__item tabs__item--active" href="#">
                  <span>{CityName.Amsterdam}</span>
                </a>
              </li>
              <li className="locations__item">
                <a className="locations__item-link tabs__item" href="#">
                  <span>{CityName.Hamburg}</span>
                </a>
              </li>
              <li className="locations__item">
                <a className="locations__item-link tabs__item" href="#">
                  <span>{CityName.Dusseldorf}</span>
                </a>
              </li>
            </ul>
          </section>
        </div>
        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">{offersCount} places to stay in {currentCity}</b>
              <form className="places__sorting" action="#" method="get">
                <span className="places__sorting-caption">Sort by</span>
                <span className="places__sorting-type" tabIndex={0}>
                  Popular
                  <svg className="places__sorting-arrow" width="7" height="4">
                    <use xlinkHref="#icon-arrow-select"></use>
                  </svg>
                </span>
              </form>
              <div className="cities__places-list places__list tabs__content">
                {filteredOffers.map((offer) => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            </section>
            <div className="cities__right-section">
              <Map
                offers={filteredOffers}
                cityName={currentCity}
                className="cities__map"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MainPage;

