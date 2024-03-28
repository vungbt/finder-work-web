import { UserOnly } from '@/configs/graphql/generated';
import { RootState } from '@/utils/redux-storage';
import { useDispatch, useSelector } from 'react-redux';
import { changeProfile } from './reducer';
import { useApiClient } from '@/libraries/providers/graphql';
import { useState } from 'react';

export default function useProfile() {
  const dispatch = useDispatch();
  const { apiClient } = useApiClient();
  const profile = useSelector((appState: RootState) => appState.profile);
  const [loading, setLoading] = useState(false);

  const getProfile = async () => {
    setLoading(true);
    const res = await apiClient.me();
    if (res.me) {
      dispatch(changeProfile(res.me as UserOnly));
    }
    setLoading(false);
    return res;
  };

  const setProfile = (user: UserOnly) => {
    dispatch(changeProfile(user));
  };

  const getFullName = (profile: UserOnly | null) => {
    if (!profile) return '';
    const firstName = profile.firstName;
    const lastName = profile.lastName;

    return firstName.concat(' ', lastName);
  };

  return {
    profile: {
      ...profile,
      fullName: getFullName(profile)
    },
    loading,
    setProfile,
    getProfile
  };
}
