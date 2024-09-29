import { Metadata, PostCategory } from '@/configs/graphql/generated';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type OptionItem = {
  label: string;
  value: string;
};

type PostCategoriesState = {
  items: PostCategory[];
  options: OptionItem[];
  metadata?: Metadata;
};

const initialState: PostCategoriesState = { items: [], options: [] };

const postCategories = createSlice({
  name: 'postCategories',
  initialState: initialState,
  reducers: {
    setPostCategories: (
      state: PostCategoriesState,
      action: PayloadAction<{ items: PostCategory[]; metadata?: Metadata }>
    ) => {
      const newState = { ...state };
      newState.items = action.payload.items;
      if (action.payload.metadata) {
        newState.metadata = action.payload.metadata;
      }
      return newState;
    },
    setPostCategoriesOptions: (state: PostCategoriesState, action: PayloadAction<OptionItem[]>) => {
      const newState = { ...state };
      newState.options = action.payload;
      return newState;
    }
  }
});

const { reducer, actions } = postCategories;
export const { setPostCategories, setPostCategoriesOptions } = actions;
export default reducer;
