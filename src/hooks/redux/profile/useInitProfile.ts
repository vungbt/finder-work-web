import { useEffect } from 'react';
import useProfile from './useProfile';
import useSessionClient from '../session/useSession';

export default function useInitProfile() {
  const { getProfile } = useProfile();
  const { session } = useSessionClient();

  useEffect(() => {
    if (session) {
      getProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);
}
