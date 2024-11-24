import { OptionItem } from '@/types';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCompanySizeOptions, setCompanyTypeOptions } from './reducer';
import useCompanyCommon from './useCompanyCommon';

export default function useInitCompanyCommon() {
  const dispatch = useDispatch();
  const { getCommon, companySizes, companyTypes } = useCompanyCommon();

  useEffect(() => {
    getCommon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    transformCompanyTypeOptions();
    transformCompanySizeOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companySizes]);

  const transformCompanyTypeOptions = () => {
    const optCompanyTypes = companyTypes.filter((item) => item.isDefault);

    const options: OptionItem[] = optCompanyTypes.map((item) => ({
      label: item.key,
      value: item.id
    }));
    dispatch(setCompanyTypeOptions(options));
  };

  const transformCompanySizeOptions = () => {
    const optCompanySizes = companySizes.filter((item) => item.isDefault);
    const options: OptionItem[] = optCompanySizes.map((item) => ({
      label: item.key,
      value: item.id
    }));
    dispatch(setCompanySizeOptions(options));
  };
}
