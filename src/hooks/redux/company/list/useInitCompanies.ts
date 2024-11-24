import { OptionItem } from '@/types';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCompaniesOptions } from './reducer';
import useCompanies from './useCompanies';

export default function useInitCompanies() {
  const dispatch = useDispatch();
  const { getCompanies, companies } = useCompanies();

  useEffect(() => {
    getCompanies({ pagination: { limit: 10, page: 1 } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    transformCompanyTypeOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companies]);

  const transformCompanyTypeOptions = () => {
    if (companies && companies.length > 0) {
      const options: OptionItem[] = companies.map((item) => ({
        label: item.name,
        value: item.id
      }));
      dispatch(setCompaniesOptions(options));
    }
  };
}
