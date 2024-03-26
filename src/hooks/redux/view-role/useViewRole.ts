import { RootState } from '@/utils/redux-storage';
import { useDispatch, useSelector } from 'react-redux';
import { changeView } from './reducer';
import { UserRole } from '@/configs/graphql/generated';

export default function useViewRole() {
  const dispatch = useDispatch();
  const viewRole = useSelector((appState: RootState) => appState.viewRole);

  const setViewRole = (role: UserRole) => {
    dispatch(changeView(role));
  };

  return { viewRole, setViewRole };
}
