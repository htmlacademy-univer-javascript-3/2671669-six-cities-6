import {Action} from '@reduxjs/toolkit';

export const extractActionTypes = (actions: Action<string>[]) => actions.map(({type}) => type);
