import useInitCountries from './redux/countries/useInitCountries';
import useInitJobCategories from './redux/job-category/useInitJobCategories';
import useInitPostCategories from './redux/post-category/useInitPostCategories';
import useInitViewRole from './redux/view-role/useInitViewRole';
import useInitSubject from './rxjs/useInitSubject';

export default function useInitBase() {
  useInitSubject();
  useInitViewRole();
  useInitCountries();
  useInitPostCategories();
  useInitJobCategories();
}
