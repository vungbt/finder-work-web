import { AllJobTitleQueryVariables, JobTitle, Metadata } from '@/configs/graphql/generated';
import { useApiClient } from '@/libraries/providers/graphql';
import { RootState } from '@/utils/redux-storage';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setJobTitles } from './reducer';

export default function useJobTitles() {
  const dispatch = useDispatch();
  const { apiClient } = useApiClient();
  const jobTitles = useSelector((appState: RootState) => appState.jobTitles);
  const [loading, setLoading] = useState(false);

  const getJobTitles = async (params?: AllJobTitleQueryVariables) => {
    setLoading(true);
    const res = await apiClient.allJobTitle(params);
    if (res.all_job_title) {
      dispatch(
        setJobTitles({
          items: (res.all_job_title.data ?? []) as JobTitle[],
          metadata: res.all_job_title.metadata as Metadata
        })
      );
    }
    setLoading(false);
    return res;
  };

  return {
    jobTitles: jobTitles.items,
    options: jobTitles.options,
    metadata: jobTitles.metadata,
    loading,
    setJobTitles: (items: JobTitle[]) => dispatch(setJobTitles({ items })),
    getJobTitles
  };
}
