import session from './session/reducer';
import viewRole from './view-role/reducer';
import countries from './countries/reducer';
import profile from './profile/reducer';
import postCategories from './post-category/reducer';
import jobCategories from './job-category/reducer';
import tags from './tags/reducer';
import tab from './tab/reducer';
import companyCommon from './company/common/reducer';
import companyList from './company/list/reducer';
import address from './address/reducer';
import jobTitles from './job-title/reducer';
import skills from './skill/reducer';
import languageSkills from './language-skill/reducer';
import language from './language/reducer';

const baseReducer = {
  session,
  viewRole,
  countries,
  profile,
  postCategories,
  jobCategories,
  tags,
  tab,
  address,
  companyCommon,
  companyList,
  jobTitles,
  skills,
  languageSkills,
  language
};

export default baseReducer;
