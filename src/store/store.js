import { configureStore } from '@reduxjs/toolkit';
import temperatureReducer from './temperature';

export const store = configureStore({
    reducer: {
        temperature: temperatureReducer,
    },
});
