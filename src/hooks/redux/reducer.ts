import session from './session/reducer';
import viewRole from './view-role/reducer';
import countries from './countries/reducer';
import profile from './profile/reducer';
import postCategories from './post-category/reducer';
import jobCategories from './job-category/reducer';

const baseReducer = { session, viewRole, countries, profile, postCategories, jobCategories };

export default baseReducer;
