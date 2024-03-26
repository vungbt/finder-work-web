import session from './session/reducer';
import viewRole from './view-role/reducer';
import countries from './countries/reducer';

const baseReducer = { session, viewRole, countries };

export default baseReducer;
