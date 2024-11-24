import { CompanySize, CompanyType } from '@/configs/graphql/generated';
import { useApiClient } from '@/libraries/providers/graphql';
import { RootState } from '@/utils/redux-storage';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCompanySize, setCompanyType } from './reducer';

export default function useCompanyCommon() {
  const dispatch = useDispatch();
  const { apiClient } = useApiClient();
  const companyCommon = useSelector((appState: RootState) => appState.companyCommon);
  const [loading, setLoading] = useState(false);

  const getCommon = async () => {
    try {
      setLoading(true);
      const res = await apiClient.companyCommon();
      const { all_company_size: companySizes, all_company_type: companyTypes } = res;
      if (companySizes && companySizes.data) {
        dispatch(
          setCompanySize({
            items: companySizes.data as CompanySize[]
          })
        );
      }
      if (companyTypes && companyTypes.data) {
        dispatch(
          setCompanyType({
            items: companyTypes.data as CompanyType[]
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
    companyTypes: companyCommon.companyTypes,
    companySizes: companyCommon.companySizes,
    optCompanySizes: companyCommon.optCompanySizes,
    optCompanyTypes: companyCommon.optCompanyTypes,
    loading,
    setCompanySize: (items: CompanySize[]) => dispatch(setCompanySize({ items })),
    setCompanyType: (items: CompanyType[]) => dispatch(setCompanyType({ items })),
    getCommon
  };
}
