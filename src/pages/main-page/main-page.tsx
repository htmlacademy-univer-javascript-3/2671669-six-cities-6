import {FC, useCallback, useEffect} from 'react';
import {useSearchParams} from 'react-router-dom';
import {CityLinkList} from '../../components/city-link-list/city-link-list.tsx';
import {HeaderLogoLink} from '../../components/shared/header-logo-link/header-logo-link.tsx';
import {HeaderUserInfo} from '../../components/shared/header-user-info/header-user-info.tsx';
import {FullSpaceSpinner} from '../../components/spinner/full-space-spinner.tsx';
import {CITY_SEARCH_PARAM} from '../../shared/entities/city/constants.ts';
import {City} from '../../shared/entities/city/types.ts';
import {isValidCity} from '../../shared/entities/city/utils.ts';
import {useAppDispatch, useAppSelector} from '../../shared/redux-helpers/typed-hooks.ts';
import {loadOffers, setCity} from '../../slices/offers-slice/offers-slice.ts';
import {MainPageEmpty} from './main-page-empty.tsx';
import {PlacesContainer} from './places-container.tsx';

export const MainPage: FC = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.offers.isOffersLoading);
  const offers = useAppSelector((state) => state.offers.currentCityOffers);
  const cities = useAppSelector((state) => state.offers.cities);
  const currentCity = useAppSelector((state) => state.offers.currentCity);

  const showEmpty = !isLoading && offers.length === 0;

  const setActiveCity = useCallback((city: City) => {
    dispatch(setCity(city.name));
  }, [dispatch]);

  useEffect(() => {
    dispatch(loadOffers());

    const cityFromSp = searchParams.get(CITY_SEARCH_PARAM);
    if (cityFromSp && isValidCity(cityFromSp)) {
      dispatch(setCity(cityFromSp));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mainClassList = ['page__main', 'page__main--index'];
  if (showEmpty) {
    mainClassList.push('page__main--index-empty');
  }

  return (
    <div className="page page--gray page--main">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <HeaderLogoLink/>
            </div>
            <HeaderUserInfo/>
          </div>
        </div>
      </header>

      <main className={mainClassList.join(' ')}>
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <section className="locations container">
            <CityLinkList cities={cities} activeCityName={currentCity} onCityClick={setActiveCity}/>
          </section>
        </div>
        <div className="cities">
          {showEmpty ? <MainPageEmpty/> : (
            <div className="cities__places-container container">
              {isLoading ? <FullSpaceSpinner/> : <PlacesContainer/>}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
