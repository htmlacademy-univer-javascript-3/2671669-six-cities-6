import {cities} from './constants.ts';
import {CityName} from './types.ts';

export const isValidCity = (city: string): city is CityName => cities.includes(city as CityName);
