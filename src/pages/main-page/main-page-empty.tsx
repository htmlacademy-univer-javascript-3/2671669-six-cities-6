import React from 'react';
import { useAppSelector } from '../../shared/redux-helpers/typed-hooks';

export const MainPageEmpty: React.FC = () => {
  const currentCity = useAppSelector((state) => state.offers.currentCity);

  return (
    <div className="cities__places-container cities__places-container--empty container">
      <section className="cities__no-places">
        <div className="cities__status-wrapper">
          <b className="cities__status">No places to stay available</b>
          <p className="cities__status-description">
            We could not find any property available at the moment in {currentCity}
          </p>
        </div>
      </section>
      <div className="cities__right-section" />
    </div>
  );
};
