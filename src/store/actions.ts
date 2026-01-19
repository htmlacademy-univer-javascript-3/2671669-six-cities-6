// src/store/actions.ts
import { createAction } from '@reduxjs/toolkit';
import { CityName } from '../shared/entities/city/types';
import { SortingOption } from '../shared/entities/sorting/types';
import { Offer } from './types';

export const changeCity = createAction<CityName>('app/changeCity');
export const setOffers = createAction<Offer[]>('app/setOffers');
export const setSortingOption = createAction<SortingOption>('app/setSortingOption');
export const setActiveCardId = createAction<string | null>('app/setActiveCardId');
