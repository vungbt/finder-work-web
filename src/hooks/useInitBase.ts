import useInitAddress from './redux/address/useInitAddress';
import useInitCompanyCommon from './redux/company/common/useInitCompanyCommon';
import useInitCompanies from './redux/company/list/useInitCompanies';
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
  useInitCompanyCommon();
  useInitAddress();
  useInitCompanies();
}
