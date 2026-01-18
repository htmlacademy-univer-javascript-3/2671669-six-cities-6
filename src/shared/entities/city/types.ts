import {Coordinates} from '../coordinates/coordinates.ts';

export enum CityName {
  Paris = 'Paris',
  Cologne = 'Cologne',
  Brussels = 'Brussels',
  Amsterdam = 'Amsterdam',
  Hamburg = 'Hamburg',
  Dusseldorf = 'Dusseldorf',
}

export type City = {
  name: string;
  location: Coordinates;
};

export type CitiesMap = Record<City['name'], City>;
