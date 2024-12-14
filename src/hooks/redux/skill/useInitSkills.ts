import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSkillsOptions } from './reducer';
import useSkills from './useSkills';

export default function useInitSkills() {
  const dispatch = useDispatch();
  const { getSkills, skills } = useSkills();

  useEffect(() => {
    getSkills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    transformSkillsOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skills]);

  const transformSkillsOptions = () => {
    const options = skills.map((item) => ({
      label: item.content,
      value: item.id
    }));

    dispatch(setSkillsOptions(options));
  };
}
