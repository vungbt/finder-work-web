import { OptionItem } from '@/types';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setJobTitlesOptions } from './reducer';
import useJobTitles from './useJobTitles';

export default function useInitJobTitle() {
  const dispatch = useDispatch();
  const { getJobTitles, jobTitles } = useJobTitles();

  useEffect(() => {
    getJobTitles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    transformJobCategoriesOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobTitles]);

  const transformJobCategoriesOptions = () => {
    const options: OptionItem[] = [];
    dispatch(setJobTitlesOptions(options));
  };
}
