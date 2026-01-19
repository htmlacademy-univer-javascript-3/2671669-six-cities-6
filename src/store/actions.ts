import { createAction } from '@reduxjs/toolkit';
import { CityName } from '../shared/entities/city/types'; // ← Импортируем enum
import { Offer } from './types';

export const changeCity = createAction<CityName>('app/changeCity'); // ← CityName!
export const setOffers = createAction<Offer[]>('app/setOffers');
