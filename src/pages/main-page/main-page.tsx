import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import OfferCard from '../../components/offer-card-list/offer-card';
import Map from '../../components/map/map';
import SortingOptions from '../../components/sorting-options/sorting-options';
import { RootState } from '../../store';
import { setActiveCardId, setSortingOption, changeCity, setOffers } from '../../store/actions';
import { sortOffers } from '../../shared/utils/sorting';
import { CityName } from '../../shared/entities/city/types';
import { SortingOption } from '../../shared/entities/sorting/types';
import { mockOffers } from '../../mocks/offers';

function MainPage() {
  const dispatch = useDispatch();
  const { city, filteredOffers, sortingOption, activeCardId } = useSelector(
    (state: RootState) => state
  );

  // Инициализация данных
  useEffect(() => {
    dispatch(setOffers(mockOffers));
  }, [dispatch]);

  // Применяем сортировку к отфильтрованным предложениям
  const sortedOffers = sortOffers(filteredOffers, sortingOption);
  const offersCount = sortedOffers.length;

  const handleSortingChange = (option: SortingOption) => {
    dispatch(setSortingOption(option));
  };

  const handleCardHover = (id: string | null) => {
    dispatch(setActiveCardId(id));
  };

  const handleCityChange = (newCity: CityName) => {
    dispatch(changeCity(newCity));
  };

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
              {Object.values(CityName).map((cityName) => (
                <li key={cityName} className="locations__item">
                  <a 
                    className={`locations__item-link tabs__item ${cityName === city ? 'tabs__item--active' : ''}`}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCityChange(cityName);
                    }}
                  >
                    <span>{cityName}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
        
        <div className="cities">
          {sortedOffers.length === 0 ? (
            <div className="cities__places-container cities__places-container--empty container">
              <section className="cities__no-places">
                <div className="cities__status-wrapper">
                  <b className="cities__status">No places to stay available</b>
                  <p className="cities__status-description">
                    We could not find any property available at the moment in {city}
                  </p>
                </div>
              </section>
              <div className="cities__right-section">
                <Map 
                  offers={sortedOffers}
                  activeCardId={activeCardId}
                  cityName={city}
                  className="cities__map cities__map--empty"
                />
              </div>
            </div>
          ) : (
            <div className="cities__places-container container">
              <section className="cities__places places">
                <h2 className="visually-hidden">Places</h2>
                <b className="places__found">{offersCount} places to stay in {city}</b>
                
                <SortingOptions 
                  currentOption={sortingOption}
                  onOptionChange={handleSortingChange}
                />
                
                <div className="cities__places-list places__list tabs__content">
                  {sortedOffers.map((offer) => (
                    <OfferCard 
                      key={offer.id} 
                      offer={offer}
                      onMouseEnter={() => handleCardHover(offer.id)}
                      onMouseLeave={() => handleCardHover(null)}
                    />
                  ))}
                </div>
              </section>
              
              <div className="cities__right-section">
                <Map 
                  offers={sortedOffers}
                  activeCardId={activeCardId}
                  cityName={city}
                  className="cities__map"
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default MainPage;

