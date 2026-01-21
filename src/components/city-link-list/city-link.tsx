import {FC} from 'react';
import {NavLink} from 'react-router-dom';
import {CITY_SEARCH_PARAM} from '../../shared/entities/city/constants.ts';
import {City} from '../../shared/entities/city/types.ts';
import {RoutePath} from '../../shared/enums/routes.ts';
import {CityLickTestIds} from './constants.ts';

type CityLinkProps = {
  city: City;
  isActive?: boolean;
  onCityClick?: (city: City) => void;
};

export const CityLink: FC<CityLinkProps> = ({city, onCityClick, isActive = false}) => {
  const linkClassName: string[] = ['locations__item-link tabs__item'];
  if (isActive) {
    linkClassName.push('tabs__item--active');
  }

  return (
    <li className="locations__item">
      <NavLink
        data-testid={CityLickTestIds.CityNavlink}
        className={linkClassName.join(' ')}
        to={{
          pathname: '/' + RoutePath.MainPage,
          search: `?${CITY_SEARCH_PARAM}=${city.name}`,
        }}
        onClick={() => onCityClick?.(city)}
      >
        <span>{city.name}</span>
      </NavLink>
    </li>
  );
};
