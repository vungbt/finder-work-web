import { ERole } from '@/types';
import localStorageHelper, { EKeyStorage } from '@/utils/helpers/local-storage';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = localStorageHelper.get(EKeyStorage.VIEW_ROLE, ERole.EMPLOYEE) as ERole;

const viewRole = createSlice({
  name: 'viewRole',
  initialState: initialState,
  reducers: {
    changeView: (state: ERole, action: PayloadAction<ERole>) => {
      localStorageHelper.set(EKeyStorage.VIEW_ROLE, action.payload);
      state = action.payload;
      return state;
    }
  }
});

const { reducer, actions } = viewRole;
export const { changeView } = actions;
export default reducer;
