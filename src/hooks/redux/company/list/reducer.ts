import { Company, Metadata } from '@/configs/graphql/generated';
import { OptionItem } from '@/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type CommonState = {
  companies: Company[];
  options: OptionItem[];
  metadata?: Metadata;
};

const initialState: CommonState = {
  companies: [],
  options: []
};

const companyCommon = createSlice({
  name: 'companyList',
  initialState: initialState,
  reducers: {
    setCompanies: (
      state: CommonState,
      action: PayloadAction<{ items: Company[]; metadata?: Metadata }>
    ) => {
      const newState = { ...state };
      newState.companies = action.payload.items;
      if (action.payload.metadata) {
        newState.metadata = action.payload.metadata;
      }
      return newState;
    },
    setCompaniesOptions: (state: CommonState, action: PayloadAction<OptionItem[]>) => {
      const newState = { ...state };
      newState.options = action.payload;
      return newState;
    }
  }
});

const { reducer, actions } = companyCommon;
export const { setCompanies, setCompaniesOptions } = actions;
export default reducer;
