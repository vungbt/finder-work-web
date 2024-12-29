import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useLanguage from './useLanguage';
import { setLanguageOption } from './reducer';

export default function useInitLanguageSkills() {
  const dispatch = useDispatch();
  const { getLanguages, language } = useLanguage();

  useEffect(() => {
    getLanguages({ pagination: { page: 1, limit: 30 } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    transformLanguageOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const transformLanguageOptions = () => {
    const options = language.map((item) => ({
      label: `${item.name}`,
      value: item.id
    }));

    dispatch(setLanguageOption(options));
  };
}
