import { apiClientServer } from '@/configs/graphql';
import { OnePostQueryVariables } from '@/configs/graphql/generated';

export const getDetailPost = async (variables: OnePostQueryVariables) => {
  const apiClient = await apiClientServer();
  const res = await apiClient.onePost(variables);
  return res.one_post;
};
