import { AllSkillQueryVariables, Metadata, Skill } from '@/configs/graphql/generated';
import { useApiClient } from '@/libraries/providers/graphql';
import { RootState } from '@/utils/redux-storage';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSkills } from './reducer';

export default function useSkills() {
  const dispatch = useDispatch();
  const { apiClient } = useApiClient();
  const skills = useSelector((appState: RootState) => appState.skills);
  const [loading, setLoading] = useState(false);

  const getSkills = async (params?: AllSkillQueryVariables) => {
    setLoading(true);
    const res = await apiClient.allSkill(params);
    if (res.all_skill) {
      dispatch(
        setSkills({
          items: (res.all_skill.data ?? []) as Skill[],
          metadata: res.all_skill.metadata as Metadata
        })
      );
    }
    setLoading(false);
    return res;
  };

  return {
    skills: skills.items,
    options: skills.options,
    metadata: skills.metadata,
    loading,
    setSkills: (items: Skill[]) => dispatch(setSkills({ items })),
    getSkills
  };
}
