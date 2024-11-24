import { City, Metadata } from '@/configs/graphql/generated';
import { OptionItem } from '@/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type CommonState = {
  address: City[];
  options: OptionItem[];
  metadata?: Metadata;
};

const initialState: CommonState = {
  address: [],
  options: []
};

const companyCommon = createSlice({
  name: 'address',
  initialState: initialState,
  reducers: {
    setAddress: (
      state: CommonState,
      action: PayloadAction<{ items: City[]; metadata?: Metadata }>
    ) => {
      const newState = { ...state };
      newState.address = action.payload.items;
      if (action.payload.metadata) {
        newState.metadata = action.payload.metadata;
      }
      return newState;
    },
    setAddressOptions: (state: CommonState, action: PayloadAction<OptionItem[]>) => {
      const newState = { ...state };
      newState.options = action.payload;
      return newState;
    }
  }
});

const { reducer, actions } = companyCommon;
export const { setAddress, setAddressOptions } = actions;
export default reducer;
