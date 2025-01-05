import { AllJobQueryVariables, Job, Metadata, PaginationInput } from '@/configs/graphql/generated';
import { useApiClient } from '@/libraries/providers/graphql';
import { useEffect, useState } from 'react';

type LandingPageEmployeeUtilsResult = {
  jobs: Job[];
  loading: boolean;
  metadata?: Metadata;
  pagination: PaginationInput;
  setPagination: (value: PaginationInput) => void;
};

export const LandingPageEmployeeUtils = (): LandingPageEmployeeUtilsResult => {
  const { apiClient } = useApiClient();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [metadata, setMetadata] = useState<Metadata>();
  const [pagination, setPagination] = useState<PaginationInput>({ page: 1, limit: 12 });

  useEffect(() => {
    fetchingJob({ pagination });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination]);

  const fetchingJob = async (variables: AllJobQueryVariables) => {
    try {
      setLoading(true);
      const res = await apiClient.allJob(variables);
      setLoading(false);
      const result = res.all_job;
      if (result && result.data) {
        setJobs(result.data as Job[]);
        setMetadata(result?.metadata as Metadata);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return {
    jobs,
    loading,
    metadata,
    pagination,
    setPagination
  };
};
