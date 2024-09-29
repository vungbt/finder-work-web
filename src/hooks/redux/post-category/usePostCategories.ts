import { Metadata, PostCategory } from '@/configs/graphql/generated';
import { useApiClient } from '@/libraries/providers/graphql';
import { RootState } from '@/utils/redux-storage';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPostCategories } from './reducer';

export default function usePostCategories() {
  const dispatch = useDispatch();
  const { apiClient } = useApiClient();
  const postCategories = useSelector((appState: RootState) => appState.postCategories);
  const [loading, setLoading] = useState(false);

  const getPostCategories = async () => {
    setLoading(true);
    const res = await apiClient.allPostCategory();
    if (res.all_post_category) {
      dispatch(
        setPostCategories({
          items: (res.all_post_category.data ?? []) as PostCategory[],
          metadata: res.all_post_category.metadata as Metadata
        })
      );
    }
    setLoading(false);
    return res;
  };

  return {
    postCategories: postCategories.items,
    options: postCategories.options,
    metadata: postCategories.metadata,
    loading,
    setPostCategories: (items: PostCategory[]) => dispatch(setPostCategories({ items })),
    getPostCategories
  };
}
