import {
  AllLanguageSkillQueryVariables,
  LanguageSkill,
  Metadata
} from '@/configs/graphql/generated';
import { useApiClient } from '@/libraries/providers/graphql';
import { RootState } from '@/utils/redux-storage';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguageSkills } from './reducer';

export default function useLanguageSkills() {
  const dispatch = useDispatch();
  const { apiClient } = useApiClient();
  const languageSkills = useSelector((appState: RootState) => appState.languageSkills);
  const [loading, setLoading] = useState(false);

  const getLanguageSkills = async (params?: AllLanguageSkillQueryVariables) => {
    if (loading) return;
    setLoading(true);
    const res = await apiClient.allLanguageSkill(params);
    if (res.all_language_skill) {
      dispatch(
        setLanguageSkills({
          items: (res.all_language_skill.data ?? []) as LanguageSkill[],
          metadata: res.all_language_skill.metadata as Metadata
        })
      );
    }
    setLoading(false);
    return res;
  };

  return {
    languageSkills: languageSkills.items,
    options: languageSkills.options,
    metadata: languageSkills.metadata,
    loading,
    setLanguageSkills: (items: LanguageSkill[]) => dispatch(setLanguageSkills({ items })),
    getLanguageSkills
  };
}
