import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    unit: 'metric',
};

const temperatureSlice = createSlice({
    name: 'temperature',
    initialState,
    reducers: {
        toggleUnit: (state) => {
            state.unit = state.unit === 'metric' ? 'imperial' : 'metric';
        },
        setUnit: (state, action) => {
            state.unit = action.payload;
        },
    },
});

export const { toggleUnit, setUnit } = temperatureSlice.actions;
export default temperatureSlice.reducer;
