import { configureStore } from '@reduxjs/toolkit';
import appReducer from './reducer';

// Создаем хранилище Redux
const store = configureStore({
  reducer: {
    app: appReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

// Экспортируем типы для TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
