import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {store} from '../../app/store.ts';

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
