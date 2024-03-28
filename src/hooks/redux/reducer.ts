import session from './session/reducer';
import viewRole from './view-role/reducer';
import countries from './countries/reducer';
import profile from './profile/reducer';

const baseReducer = { session, viewRole, countries, profile };

export default baseReducer;
