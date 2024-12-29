import { Language, Metadata, AllLanguageQueryVariables } from '@/configs/graphql/generated';
import { useApiClient } from '@/libraries/providers/graphql';
import { RootState } from '@/utils/redux-storage';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from './reducer';

export default function useLanguage() {
  const dispatch = useDispatch();
  const { apiClient } = useApiClient();
  const language = useSelector((appState: RootState) => appState.language);
  const [loading, setLoading] = useState(false);

  const getLanguages = async (params?: AllLanguageQueryVariables) => {
    if (loading) return;
    setLoading(true);
    const res = await apiClient.allLanguage(params);
    if (res.all_language) {
      dispatch(
        setLanguage({
          items: (res.all_language.data ?? []) as Language[],
          metadata: res.all_language.metadata as Metadata
        })
      );
    }
    setLoading(false);
    return res;
  };

  return {
    language: language.items,
    options: language.options,
    metadata: language.metadata,
    loading,
    setLanguage: (items: Language[]) => dispatch(setLanguage({ items })),
    getLanguages
  };
}
