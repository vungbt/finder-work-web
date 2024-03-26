import { UserOnly } from '@/configs/graphql/generated';
import { RootState } from '@/utils/redux-storage';
import { useDispatch, useSelector } from 'react-redux';
import { changeProfile } from './reducer';

export default function useProfile() {
  const dispatch = useDispatch();
  const profile = useSelector((appState: RootState) => appState.profile);

  const setProfile = (user: UserOnly) => {
    dispatch(changeProfile(user));
  };

  return { profile, setProfile };
}
