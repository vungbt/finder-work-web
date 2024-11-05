import { TabItem } from '@/libraries/common';
import { useSearchQuery } from '@/utils/navigation';
import { RootState } from '@/utils/redux-storage';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTab } from './reducer';

export enum ETabKey {
  WorkProfile = 'work_profile'
}

export default function useTab({
  key = ETabKey.WorkProfile,
  tabs = []
}: {
  key?: ETabKey;
  tabs: TabItem[];
}) {
  const dispatch = useDispatch();
  const tab = useSelector((appState: RootState) => appState.tab);
  const { searchQuery } = useSearchQuery<{ slug: string }>({ slug: tabs[0].value });

  const currentTab = useMemo(() => {
    if (!key || key.length <= 0) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (tab as any)[`${key}`];
  }, [tab, key]);

  useEffect(() => {
    const tabActive = tabs.find((item) => item.value === searchQuery?.slug);
    if (tabActive) {
      dispatch(setTab({ item: tabActive, key }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, key]);

  return {
    tabActive: currentTab,
    setTabActive: (item: TabItem) => dispatch(setTab({ item, key }))
  };
}
