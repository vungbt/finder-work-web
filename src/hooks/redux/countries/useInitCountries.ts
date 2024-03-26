import { Country } from '@/configs/graphql/generated';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCountries, setPhoneOptions } from './reducer';

export default function useInitCountries() {
  const dispatch = useDispatch();

  useEffect(() => {
    getAllCountries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAllCountries = async () => {
    try {
      const res = await fetch('/country/index.json');
      const data = await res.json();
      const countries = (data?.countries ?? []) as Country[];
      transformPhoneOptions(countries);
      dispatch(setCountries(countries));
      return;
    } catch (error) {
      return [];
    }
  };

  const transformPhoneOptions = (items: Country[]) => {
    const phoneOptions = items.map((item) => {
      let phoneCode = item?.phoneCode?.trim();
      if (!phoneCode.startsWith('+')) {
        phoneCode = `+${phoneCode}`;
      }

      return {
        label: `${item.emoji} ${phoneCode}`,
        value: item.id
      };
    });

    dispatch(setPhoneOptions(phoneOptions));
  };
}
