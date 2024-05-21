import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPostCategoriesOptions } from './reducer';
import usePostCategories from './usePostCategories';

export default function useInitPostCategories() {
  const dispatch = useDispatch();
  const { getPostCategories, postCategories } = usePostCategories();

  useEffect(() => {
    getPostCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    transformPostCategoriesOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postCategories]);

  const transformPostCategoriesOptions = () => {
    const options = postCategories.map((item) => ({
      label: item.name,
      value: item.id
    }));

    dispatch(setPostCategoriesOptions(options));
  };
}
