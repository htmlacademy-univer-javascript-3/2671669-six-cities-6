import {FC, useCallback, useEffect} from 'react';
import {CityLinkList} from '../../components/city-link-list/city-link-list.tsx';
import {loadOffers, setCity} from '../../slices/offers-slice/offers-slice.ts';
import {useAppDispatch, useAppSelector} from '../../shared/redux-helpers/typed-hooks.ts';
import {FullSpaceSpinner} from '../../components/spinner/full-space-spinner.tsx';
import {PlacesContainer} from './places-container.tsx';

export const MainPage: FC = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.offers.isOffersLoading);
  const cities = useAppSelector((state) => state.offers.cities);
  const currentCity = useAppSelector((state) => state.offers.currentCity);

  const setActiveCity = (city: City) => {
    dispatch(setCity(city));

    const cityName = city.name;
    const newOffers = initialOffers.filter((offer) => offer.city === cityName);
    dispatch(setOffers(newOffers));
  };

  useEffect(() => {
    dispatch(loadOffers());
  }, []);

  return (
    <div className="page page--gray page--main">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <a className="header__logo-link header__logo-link--active">
                <img className="header__logo" src="img/logo.svg" alt="6 cities logo" width="81" height="41"/>
              </a>
            </div>
            <nav className="header__nav">
              <ul className="header__nav-list">
                <li className="header__nav-item user">
                  <a className="header__nav-link header__nav-link--profile" href="#">
                    <div className="header__avatar-wrapper user__avatar-wrapper">
                    </div>
                    <span className="header__user-name user__name">Oliver.conner@gmail.com</span>
                    <span className="header__favorite-count">3</span>
                  </a>
                </li>
                <li className="header__nav-item">
                  <a className="header__nav-link" href="#">
                    <span className="header__signout">Sign out</span>
                  </a>
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
            <CityLinkList cities={cities} activeCity={currentCity} onCityClick={setActiveCity}/>
          </section>
        </div>
        <div className="cities">
          <div className="cities__places-container container">
            {isLoading ? <FullSpaceSpinner/> : <PlacesContainer/>}
          </div>
        </div>
      </main>
    </div>
  );
};
