import { AllCompanyQueryVariables, Company, Metadata } from '@/configs/graphql/generated';
import { useApiClient } from '@/libraries/providers/graphql';
import { RootState } from '@/utils/redux-storage';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCompanies } from './reducer';

export default function useCompanies() {
  const dispatch = useDispatch();
  const { apiClient } = useApiClient();
  const companies = useSelector((appState: RootState) => appState.companyList);
  const [loading, setLoading] = useState(false);

  const getCompanies = async (params?: AllCompanyQueryVariables) => {
    try {
      setLoading(true);
      const res = await apiClient.allCompany(params);
      if (res.all_company) {
        dispatch(
          setCompanies({
            items: (res?.all_company?.data ?? []) as Company[],
            metadata: res.all_company.metadata as Metadata
          })
        );
      }
      setLoading(false);
      return res;
    } catch {
      setLoading(false);
    }
  };

  return {
    companies: companies.companies,
    metadata: companies.metadata,
    options: companies.options,
    loading,
    setCompanies: (items: Company[], metadata?: Metadata) =>
      dispatch(setCompanies({ items, metadata })),
    getCompanies
  };
}
