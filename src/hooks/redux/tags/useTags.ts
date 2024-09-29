import { AllTagQueryVariables, Metadata, Tag, TagType } from '@/configs/graphql/generated';
import { useApiClient } from '@/libraries/providers/graphql';
import { RootState } from '@/utils/redux-storage';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTags } from './reducer';

export default function useTags() {
  const dispatch = useDispatch();
  const { apiClient } = useApiClient();
  const tags = useSelector((appState: RootState) => appState.tags);
  const [loading, setLoading] = useState(false);

  const getTags = async (variables?: AllTagQueryVariables, type?: TagType) => {
    setLoading(true);
    const res = await apiClient.allTag(variables);
    setLoading(false);
    if (res.all_tag) {
      dispatch(
        setTags({
          items: (res.all_tag.data ?? []) as Tag[],
          metadata: res.all_tag.metadata as Metadata,
          type
        })
      );
    }
    return res;
  };

  return {
    postTagOptions: tags.postTagOptions,
    postTags: tags.postTags,
    jobTagOptions: tags.jobTagOptions,
    jobTags: tags.jobTags,
    skillTagOptions: tags.skillTagOptions,
    skillTags: tags.skillTags,
    metadata: tags.metadata,
    loading,
    setTags: (items: Tag[], type?: TagType) => dispatch(setTags({ items, type })),
    getTags
  };
}
