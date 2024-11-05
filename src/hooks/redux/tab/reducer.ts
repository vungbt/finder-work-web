import { TabItem } from '@/libraries/common';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ETabKey } from './useTab';

type TabState = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tabAction: Record<ETabKey, TabItem> | any;
};

const initialState: TabState = {
  tabAction: {}
};

const tab = createSlice({
  name: 'tab',
  initialState: initialState,
  reducers: {
    setTab: (state: TabState, action: PayloadAction<{ item: TabItem; key: ETabKey }>) => {
      const payload = action.payload;
      const newState = { ...state };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (newState as any)[`${payload.key}`] = payload.item;

      return newState;
    }
  }
});

const { reducer, actions } = tab;
export const { setTab } = actions;
export default reducer;
