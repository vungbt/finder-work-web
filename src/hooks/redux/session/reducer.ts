import localStorageHelper, { EKeyStorage } from '@/utils/helpers/local-storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Session } from 'next-auth';

const initialState: Session | null = localStorageHelper.getObject(EKeyStorage.SESSION, null);

const session = createSlice({
  name: 'session',
  initialState: initialState,
  reducers: {
    changeSession: (state: Session | null, action: PayloadAction<Session | null>) => {
      localStorageHelper.setObject(EKeyStorage.SESSION, action.payload);
      state = action.payload;
      return state;
    }
  }
});

const { reducer, actions } = session;
export const { changeSession } = actions;
export default reducer;
