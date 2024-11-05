import useInitProfile from './redux/profile/useInitProfile';
import useInitSession from './redux/session/useInitSession';

export default function useInitPortal() {
  useInitProfile();
  useInitSession();
}
