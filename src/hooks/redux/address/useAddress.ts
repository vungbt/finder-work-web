import { AllAddressQueryVariables, City, Metadata } from '@/configs/graphql/generated';
import { useApiClient } from '@/libraries/providers/graphql';
import { RootState } from '@/utils/redux-storage';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAddress } from './reducer';
import { OptionItem } from '@/types';

export default function useAddress() {
  const dispatch = useDispatch();
  const { apiClient } = useApiClient();
  const address = useSelector((appState: RootState) => appState.address);
  const [loading, setLoading] = useState(false);

  const getAddress = async (params?: AllAddressQueryVariables) => {
    try {
      setLoading(true);
      const res = await apiClient.allAddress(params);
      if (res.all_address) {
        dispatch(
          setAddress({
            items: (res?.all_address?.data ?? []) as City[],
            metadata: res.all_address.metadata as Metadata
          })
        );
      }
      setLoading(false);
      return res;
    } catch {
      setLoading(false);
    }
  };

  const convertToOptions = (data: City[]) => {
    const options: OptionItem[] = [];
    data.forEach((item) => {
      let label = item.name;
      if (item.stateName) {
        label = `${label} - ${item.stateName}`;
      }
      if (item.countryName) {
        label = `${label} - ${item.countryName}`;
      }
      options.push({
        label: label,
        value: item.id
      });
    });
    return options;
  };

  return {
    address: address.address,
    metadata: address.metadata,
    options: address.options,
    loading,
    convertToOptions,
    setAddress: (items: City[], metadata?: Metadata) => dispatch(setAddress({ items, metadata })),
    getAddress
  };
}
