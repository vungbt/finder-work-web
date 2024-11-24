import { CompanySize, CompanyType } from '@/configs/graphql/generated';
import { OptionItem } from '@/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type CommonState = {
  companyTypes: CompanyType[];
  optCompanyTypes: OptionItem[];
  companySizes: CompanySize[];
  optCompanySizes: OptionItem[];
};

const initialState: CommonState = {
  companyTypes: [],
  optCompanyTypes: [],
  companySizes: [],
  optCompanySizes: []
};

const companyCommon = createSlice({
  name: 'companyCommon',
  initialState: initialState,
  reducers: {
    setCompanyType: (state: CommonState, action: PayloadAction<{ items: CompanyType[] }>) => {
      const newState = { ...state };
      newState.companyTypes = action.payload.items;
      return newState;
    },
    setCompanyTypeOptions: (state: CommonState, action: PayloadAction<OptionItem[]>) => {
      const newState = { ...state };
      newState.optCompanyTypes = action.payload;
      return newState;
    },
    setCompanySize: (state: CommonState, action: PayloadAction<{ items: CompanySize[] }>) => {
      const newState = { ...state };
      newState.companySizes = action.payload.items;
      return newState;
    },
    setCompanySizeOptions: (state: CommonState, action: PayloadAction<OptionItem[]>) => {
      const newState = { ...state };
      newState.optCompanySizes = action.payload;
      return newState;
    }
  }
});

const { reducer, actions } = companyCommon;
export const { setCompanyType, setCompanyTypeOptions, setCompanySize, setCompanySizeOptions } =
  actions;
export default reducer;
