import {City, CityName} from './types.ts';

export const cities: CityName[] = [...Object.values(CityName)];

export const DEFAULT_CITY: City = {
  name: CityName.Paris,
  location: {latitude: 48.85661, longitude: 2.351499, zoom: 13},
};

export const CITY_SEARCH_PARAM = 'city';
