import { ERole } from '@/types';
import { RootState } from '@/utils/redux-storage';
import { useDispatch, useSelector } from 'react-redux';
import { changeView } from './reducer';

export default function useViewRole() {
  const dispatch = useDispatch();
  const viewRole = useSelector((appState: RootState) => appState.viewRole);

  const setViewRole = (role: ERole) => {
    dispatch(changeView(role));
  };

  return { viewRole, setViewRole };
}
