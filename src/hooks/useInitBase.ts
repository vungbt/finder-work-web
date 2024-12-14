import useInitAddress from './redux/address/useInitAddress';
import useInitCompanyCommon from './redux/company/common/useInitCompanyCommon';
import useInitCompanies from './redux/company/list/useInitCompanies';
import useInitCountries from './redux/countries/useInitCountries';
import useInitJobCategories from './redux/job-category/useInitJobCategories';
import useInitJobTitles from './redux/job-title/useInitJobTitles';
import useInitLanguageSkills from './redux/language-skill/useInitLanguageSkills';
import useInitPostCategories from './redux/post-category/useInitPostCategories';
import useInitSkills from './redux/skill/useInitSkills';
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
  useInitJobTitles();
  useInitSkills();
  useInitLanguageSkills();
}
