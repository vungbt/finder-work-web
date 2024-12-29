import { Language, Metadata } from '@/configs/graphql/generated';
import { OptionItem } from '@/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type LanguageState = {
  items: Language[];
  options: OptionItem[];
  metadata?: Metadata;
};

const initialState: LanguageState = { items: [], options: [] };

const language = createSlice({
  name: 'language',
  initialState: initialState,
  reducers: {
    setLanguage: (
      state: LanguageState,
      action: PayloadAction<{ items: Language[]; metadata?: Metadata }>
    ) => {
      const newState = { ...state };
      newState.items = action.payload.items;
      if (action.payload.metadata) {
        newState.metadata = action.payload.metadata;
      }
      return newState;
    },
    setLanguageOption: (state: LanguageState, action: PayloadAction<OptionItem[]>) => {
      const newState = { ...state };
      newState.options = action.payload;
      return newState;
    }
  }
});

const { reducer, actions } = language;
export const { setLanguage, setLanguageOption } = actions;
export default reducer;
