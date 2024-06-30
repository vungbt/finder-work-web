import { JobCategory, Metadata } from '@/configs/graphql/generated';
import { GroupedOptionItem } from '@/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type JobCategoryState = {
  items: JobCategory[];
  options: GroupedOptionItem[];
  metadata?: Metadata;
};

const initialState: JobCategoryState = { items: [], options: [] };

const jobCategories = createSlice({
  name: 'jobCategories',
  initialState: initialState,
  reducers: {
    setJobCategories: (
      state: JobCategoryState,
      action: PayloadAction<{ items: JobCategory[]; metadata?: Metadata }>
    ) => {
      const newState = { ...state };
      newState.items = action.payload.items;
      if (action.payload.metadata) {
        newState.metadata = action.payload.metadata;
      }
      return newState;
    },
    setJobCategoriesOptions: (
      state: JobCategoryState,
      action: PayloadAction<GroupedOptionItem[]>
    ) => {
      const newState = { ...state };
      newState.options = action.payload;
      return newState;
    }
  }
});

const { reducer, actions } = jobCategories;
export const { setJobCategories, setJobCategoriesOptions } = actions;
export default reducer;
