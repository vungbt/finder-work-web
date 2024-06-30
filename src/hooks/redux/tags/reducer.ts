import { Metadata, Tag, TagType } from '@/configs/graphql/generated';
import { OptionItem } from '@/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type TagsState = {
  postTags: Tag[];
  skillTags: Tag[];
  jobTags: Tag[];
  postTagOptions: OptionItem[];
  skillTagOptions: OptionItem[];
  jobTagOptions: OptionItem[];
  metadata?: Metadata;
};

const initialState: TagsState = {
  postTags: [],
  postTagOptions: [],
  skillTags: [],
  skillTagOptions: [],
  jobTags: [],
  jobTagOptions: []
};

const tags = createSlice({
  name: 'tags',
  initialState: initialState,
  reducers: {
    setTags: (
      state: TagsState,
      action: PayloadAction<{ items: Tag[]; metadata?: Metadata; type?: TagType }>
    ) => {
      const newState = { ...state };
      const items = action.payload?.items ?? [];
      const options = items.map((item) => ({
        label: item.name,
        value: item.id
      }));

      switch (action.type) {
        case TagType.Post:
          newState.postTags = items;
          newState.postTagOptions = options;
          break;
        case TagType.Job:
          newState.jobTags = items;
          newState.jobTagOptions = options;
          break;
        case TagType.Skill:
          newState.skillTags = items;
          newState.skillTagOptions = options;
          break;
        default:
          newState.postTags = items;
          newState.postTagOptions = options;
      }
      if (action.payload.metadata) {
        newState.metadata = action.payload.metadata;
      }
      return newState;
    }
  }
});

const { reducer, actions } = tags;
export const { setTags } = actions;
export default reducer;
