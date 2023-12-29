import localStorageHelper, { EKeyStorage } from '@/utils/helpers/local-storage';
import { useEffect } from 'react';
import useViewRole from './useViewRole';

export default function useInitViewRole() {
  const { viewRole } = useViewRole();

  useEffect(() => {
    localStorageHelper.set(EKeyStorage.VIEW_ROLE, viewRole);
  }, [viewRole]);
}
