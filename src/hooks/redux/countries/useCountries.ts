import { getCountryCode } from '@/utils/helpers/common';
import { RootState } from '@/utils/redux-storage';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export default function useCountries() {
  const countries = useSelector((appState: RootState) => appState.countries ?? null);
  const countryCode = getCountryCode();

  const defaultPhoneCode = useMemo(() => {
    const items = countries.items;
    const country = items.find(
      (item) => String(item.iso2).toUpperCase() === String(countryCode).toUpperCase()
    );

    if (!country) return null;

    let phoneCode = country?.phoneCode?.trim();
    if (!phoneCode.startsWith('+')) {
      phoneCode = `+${phoneCode}`;
    }

    return {
      label: `${country.emoji} ${phoneCode}`,
      value: country.id
    };
  }, [countryCode, countries]);

  return {
    countries: countries.items,
    options: countries.phoneOptions,
    defaultOption: defaultPhoneCode
  };
}
