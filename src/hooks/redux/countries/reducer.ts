import { Country } from '@/configs/graphql/generated';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type OptionItem = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  label: any;
  value: string;
};

type CountriesState = {
  items: Country[];
  phoneOptions: OptionItem[];
};

const initialState: CountriesState = { items: [], phoneOptions: [] };

const countries = createSlice({
  name: 'countries',
  initialState: initialState,
  reducers: {
    setCountries: (state: CountriesState, action: PayloadAction<Country[]>) => {
      const newState = { ...state };
      newState.items = action.payload;
      return newState;
    },
    setPhoneOptions: (state: CountriesState, action: PayloadAction<OptionItem[]>) => {
      const newState = { ...state };
      newState.phoneOptions = action.payload;
      return newState;
    }
  }
});

const { reducer, actions } = countries;
export const { setCountries, setPhoneOptions } = actions;
export default reducer;
