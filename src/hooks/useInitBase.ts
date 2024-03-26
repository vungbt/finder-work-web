import useInitCountries from './redux/countries/useInitCountries';
import useInitSession from './redux/session/useInitSession';
import useInitViewRole from './redux/view-role/useInitViewRole';
import useInitSubject from './rxjs/useInitSubject';

export default function useInitBase() {
  useInitSubject();
  useInitSession();
  useInitViewRole();
  useInitCountries();
}
