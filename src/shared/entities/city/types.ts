import {Coordinates} from '../coordinates/coordinates.ts'; //C:\Users\astonuser\cities\2671669-six-cities-6\src\shared\entities\coordinates\coordinates.ts

export type City = {
  name: string;
  location: Coordinates;
};

export type CitiesMap = Record<City['name'], City>;
