import { JobTitle, Metadata } from '@/configs/graphql/generated';
import { GroupedOptionItem, OptionItem } from '@/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type JobTitleState = {
  items: JobTitle[];
  options: OptionItem[];
  metadata?: Metadata;
};

const initialState: JobTitleState = { items: [], options: [] };

const jobTitles = createSlice({
  name: 'jobTitles',
  initialState: initialState,
  reducers: {
    setJobTitles: (
      state: JobTitleState,
      action: PayloadAction<{ items: JobTitle[]; metadata?: Metadata }>
    ) => {
      const newState = { ...state };
      newState.items = action.payload.items;
      if (action.payload.metadata) {
        newState.metadata = action.payload.metadata;
      }
      return newState;
    },
    setJobTitlesOptions: (state: JobTitleState, action: PayloadAction<OptionItem[]>) => {
      const newState = { ...state };
      newState.options = action.payload;
      return newState;
    }
  }
});

const { reducer, actions } = jobTitles;
export const { setJobTitles, setJobTitlesOptions } = actions;
export default reducer;
