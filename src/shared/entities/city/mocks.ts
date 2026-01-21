import {CitiesMap, City, CityName} from './types.ts';

const mockCity: City = {
  name: CityName.Paris,
  location: {
    longitude: 0,
    latitude: 0,
    zoom: 13,
  },
};

export const getMockCity = (overrides: Partial<City> = {}): City => ({...mockCity, ...overrides});

export const getMockCityMap = (cityNames: City['name'][] = [CityName.Paris]): CitiesMap => {
  return cityNames.reduce((cities, name) => {
    cities[name] = getMockCity({name});
    return cities;
  }, {} as CitiesMap);
};
