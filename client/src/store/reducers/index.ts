import { combineReducers } from 'redux';
import { authentication } from './authentication.reducer';
import { registration } from './registration.reducer';
import { alert } from './alert.reducer';

const rootReducer = combineReducers({
    alert,
    authentication,
    registration
});

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer;
