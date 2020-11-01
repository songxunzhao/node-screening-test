import {userConstants} from "../constants";
import { Action } from 'redux';

interface RegistrationState {
    registering?: boolean
}

export function registration(state: RegistrationState = {}, action: Action) {
    switch (action.type) {
        case userConstants.REGISTER_REQUEST:
            return { registering: true };
        case userConstants.REGISTER_SUCCESS:
            return {};
        case userConstants.REGISTER_FAILURE:
            return {};
        default:
            return state
    }
}
