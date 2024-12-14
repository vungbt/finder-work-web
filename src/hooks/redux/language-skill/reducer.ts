import { LanguageSkill, Metadata } from '@/configs/graphql/generated';
import { OptionItem } from '@/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type LanguageSkillsState = {
  items: LanguageSkill[];
  options: OptionItem[];
  metadata?: Metadata;
};

const initialState: LanguageSkillsState = { items: [], options: [] };

const languageSkill = createSlice({
  name: 'languageSkill',
  initialState: initialState,
  reducers: {
    setLanguageSkills: (
      state: LanguageSkillsState,
      action: PayloadAction<{ items: LanguageSkill[]; metadata?: Metadata }>
    ) => {
      const newState = { ...state };
      newState.items = action.payload.items;
      if (action.payload.metadata) {
        newState.metadata = action.payload.metadata;
      }
      return newState;
    },
    setLanguageSkillsOptions: (state: LanguageSkillsState, action: PayloadAction<OptionItem[]>) => {
      const newState = { ...state };
      newState.options = action.payload;
      return newState;
    }
  }
});

const { reducer, actions } = languageSkill;
export const { setLanguageSkills, setLanguageSkillsOptions } = actions;
export default reducer;
