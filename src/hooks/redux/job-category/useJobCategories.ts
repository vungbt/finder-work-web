import { JobCategory, Metadata } from '@/configs/graphql/generated';
import { useApiClient } from '@/libraries/providers/graphql';
import { RootState } from '@/utils/redux-storage';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setJobCategories } from './reducer';

export default function useJobCategories() {
  const dispatch = useDispatch();
  const { apiClient } = useApiClient();
  const jobCategories = useSelector((appState: RootState) => appState.jobCategories);
  const [loading, setLoading] = useState(false);

  const getJobCategories = async () => {
    setLoading(true);
    const res = await apiClient.allJobCategory();
    if (res.all_job_category) {
      dispatch(
        setJobCategories({
          items: (res.all_job_category.data ?? []) as JobCategory[],
          metadata: res.all_job_category.metadata as Metadata
        })
      );
    }
    setLoading(false);
    return res;
  };

  return {
    jobCategories: jobCategories.items,
    options: jobCategories.options,
    metadata: jobCategories.metadata,
    loading,
    setJobCategories: (items: JobCategory[]) => dispatch(setJobCategories({ items })),
    getJobCategories
  };
}
