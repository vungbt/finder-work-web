import { onSignOut } from '@/@handles/auth';
import { UserOnly } from '@/configs/graphql/generated';
import { StatusCodes } from '@/constants/common';
import { useApiClient } from '@/libraries/providers/graphql';
import { RootState } from '@/utils/redux-storage';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeProfile } from './reducer';

export default function useProfile() {
  const dispatch = useDispatch();
  const { apiClient } = useApiClient();
  const profile = useSelector((appState: RootState) => appState.profile);
  const [loading, setLoading] = useState(false);

  const getProfile = async () => {
    try {
      setLoading(true);
      const res = await apiClient.me();
      if (res.me) {
        dispatch(changeProfile(res.me as UserOnly));
      }
      setLoading(false);
      return res;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errResponse = error?.response;
      if (!errResponse || Object.keys(errResponse).length <= 0) return;
      const errors = errResponse?.errors ?? [];
      if (!errors || errors.length <= 0) return;
      const statusCode = errors[0]?.statusCode;
      if (statusCode === StatusCodes.NOT_FOUND) return onSignOut();
    }
  };

  const setProfile = (user: UserOnly) => {
    dispatch(changeProfile(user));
  };

  const getFullName = (profile: UserOnly | null) => {
    if (!profile) return '';
    const firstName = profile?.firstName;
    const lastName = profile?.lastName;

    return firstName.concat(' ', lastName);
  };

  return {
    profile: {
      ...profile,
      fullName: getFullName(profile)
    } as UserOnly,
    loading,
    setProfile,
    getProfile
  };
}
