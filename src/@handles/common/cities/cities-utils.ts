import {
  AllCitiesQueryVariables,
  City,
  PaginationInput,
  SortOrder
} from '@/configs/graphql/generated';
import { useApiClient } from '@/libraries/providers/graphql';

import { useEffect, useState } from 'react';

type CitiesUtilResults = {
  data: City[];
  setSearchValue: (value: string) => void;
  setPagination: (value: PaginationInput) => void;
  onSort?: (values: Record<string, SortOrder>[]) => void;
};

export function CitiesUtils(): CitiesUtilResults {
  const { apiClient } = useApiClient();
  const [searchValue, setSearchValue] = useState<string>('');
  const [sortActives, setSortActives] = useState<Record<string, SortOrder>[]>([]);
  const [pagination, setPagination] = useState<PaginationInput>({ page: 1, limit: 30 });
  const [data, setData] = useState<City[]>([]);

  useEffect(() => {
    fetchingAllCities({ searchValue, pagination });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, pagination, sortActives]);
  const fetchingAllCities = async (variables: AllCitiesQueryVariables) => {
    try {
      const res = await apiClient.allCities(variables);
      const result = res.all_address;
      setData(result?.flatMap((address) => address.data) as City[]);
    } catch (error) {
      console.error('Failed to fetch cities:', error);
    }
  };
  return {
    data,
    setSearchValue,
    setPagination,
    onSort: setSortActives
  };
}
