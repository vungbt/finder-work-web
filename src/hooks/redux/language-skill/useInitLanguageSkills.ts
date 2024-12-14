import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLanguageSkillsOptions } from './reducer';
import useLanguageSkills from './useLanguageSkills';

export default function useInitLanguageSkills() {
  const dispatch = useDispatch();
  const { getLanguageSkills, languageSkills } = useLanguageSkills();

  useEffect(() => {
    getLanguageSkills({ pagination: { page: 1, limit: 30 } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    transformLanguageSkillsOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languageSkills]);

  const transformLanguageSkillsOptions = () => {
    const options = languageSkills.map((item) => ({
      label: `${item.name} - ${item.proficiencyLevel}`,
      value: item.id
    }));

    dispatch(setLanguageSkillsOptions(options));
  };
}
