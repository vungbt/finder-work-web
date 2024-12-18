import { apiClientServer } from '@/configs/graphql';
import { OneJobQueryVariables } from '@/configs/graphql/generated';

export const getDetailJob = async (variables: OneJobQueryVariables) => {
  const apiClient = await apiClientServer();
  const res = await apiClient.oneJob(variables);
  return res.one_job;
};
