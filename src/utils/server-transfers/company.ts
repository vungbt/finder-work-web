import { apiClientServer } from '@/configs/graphql';
import { OneCompanyQueryVariables } from '@/configs/graphql/generated';

export const getDetailCompany = async (variables: OneCompanyQueryVariables) => {
  const apiClient = await apiClientServer();
  const res = await apiClient.oneCompany(variables);
  return res.one_company;
};
