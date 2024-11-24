import { OptionItem } from '@/types';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAddressOptions } from './reducer';
import useAddress from './useAddress';

export default function useInitAddress() {
  const dispatch = useDispatch();
  const { getAddress, address, convertToOptions } = useAddress();

  useEffect(() => {
    getAddress({ pagination: { limit: 20, page: 1 } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    transformCompanyTypeOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const transformCompanyTypeOptions = () => {
    if (address && address.length > 0) {
      const options: OptionItem[] = convertToOptions(address);
      dispatch(setAddressOptions(options));
    }
  };
}
