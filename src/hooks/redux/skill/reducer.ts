import { Metadata, Skill } from '@/configs/graphql/generated';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type OptionItem = {
  label: string;
  value: string;
};

type SkillsState = {
  items: Skill[];
  options: OptionItem[];
  metadata?: Metadata;
};

const initialState: SkillsState = { items: [], options: [] };

const skills = createSlice({
  name: 'skills',
  initialState: initialState,
  reducers: {
    setSkills: (
      state: SkillsState,
      action: PayloadAction<{ items: Skill[]; metadata?: Metadata }>
    ) => {
      const newState = { ...state };
      newState.items = action.payload.items;
      if (action.payload.metadata) {
        newState.metadata = action.payload.metadata;
      }
      return newState;
    },
    setSkillsOptions: (state: SkillsState, action: PayloadAction<OptionItem[]>) => {
      const newState = { ...state };
      newState.options = action.payload;
      return newState;
    }
  }
});

const { reducer, actions } = skills;
export const { setSkills, setSkillsOptions } = actions;
export default reducer;
