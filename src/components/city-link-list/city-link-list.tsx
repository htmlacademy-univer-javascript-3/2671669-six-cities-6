import React, {FC} from 'react';
import {CitiesMap, City} from '../../shared/entities/city/types.ts';
import {CityLink} from './city-link.tsx';

type CityLinkListProps = {
  cities: CitiesMap;
  activeCityName: City['name'];
  onCityClick?: (city: City) => void;
};

export const CityLinkList: FC<CityLinkListProps> = React.memo(({cities, activeCityName, onCityClick}) => {
  return (
    <ul className="locations__list tabs__list">
      {Object.values(cities).map((city) => (
        <CityLink
          key={city.name}
          city={city}
          onCityClick={onCityClick}
          isActive={activeCityName === city.name}
          data-testid={'sss'}
        />
      ))}
    </ul>
  );
});

CityLinkList.displayName = 'CityLinkList';
