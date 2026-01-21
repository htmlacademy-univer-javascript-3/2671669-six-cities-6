import {FC} from 'react';
import {City} from '../../shared/entities/city/types.ts';

type CityLinkProps = {
  city: City;
  href: string;
  isActive?: boolean;
  onCityClick?: (city: City) => void;
};

export const CityLink: FC<CityLinkProps> = ({city, href, onCityClick, isActive = false}) => {
  const linkClassName: string[] = ['locations__item-link tabs__item'];
  if (isActive) {
    linkClassName.push('tabs__item--active');
  }

  return (
    <li className="locations__item">
      <a className={linkClassName.join(' ')} href={href} onClick={() => onCityClick?.(city)}>
        <span>{city.name}</span>
      </a>
    </li>
  );
};
