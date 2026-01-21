import {FC} from 'react';
import {RoutePath} from '../../shared/enums/routes.ts';
import {CitiesMap, City} from '../../shared/entities/city/types.ts';
import {CityLink} from './city-link.tsx';

type CityLinkListProps = {
  cities: CitiesMap;
  activeCity: City;
  onCityClick: (city: City) => void;
};
export const CityLinkList: FC<CityLinkListProps> = ({cities, activeCity, onCityClick}) => {
  const activeCityName = activeCity.name;
  return (
    <ul className="locations__list tabs__list">
      {Object.values(cities).map((city) => (
        <CityLink
          key={city.name}
          city={city}
          href={`${RoutePath.MainPage}/#`}
          onCityClick={onCityClick}
          isActive={activeCityName === city.name}
        />
      ))}
    </ul>
  );
};
