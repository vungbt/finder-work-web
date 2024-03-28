import { UserOnly } from '@/configs/graphql/generated';
import localStorageHelper, { EKeyStorage } from '@/utils/helpers/local-storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: UserOnly | null = localStorageHelper.getObject(EKeyStorage.PROFILE, null);

const profile = createSlice({
  name: 'profile',
  initialState: initialState,
  reducers: {
    changeProfile: (state: UserOnly | null, action: PayloadAction<UserOnly | null>) => {
      localStorageHelper.setObject(EKeyStorage.PROFILE, action.payload);
      state = action.payload;
      return state;
    }
  }
});

const { reducer, actions } = profile;
export const { changeProfile } = actions;
export default reducer;
