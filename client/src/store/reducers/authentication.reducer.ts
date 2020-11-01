import { userConstants } from "../constants";
import { Action } from 'redux';
import { UserModel } from "../../models";
import { authStorage } from "../../services";

const auth = authStorage.load();

const initialState = auth ? { loggedIn: true, user: auth.user, token: auth.token } : {};

export interface AuthAction extends Action {
    user: UserModel;
    token: string;
}

export interface AuthenticationState {
    loggingIn?: boolean;
    loggedIn?: boolean;
    user?: UserModel;
    token?: string;
}

export function authentication(state: AuthenticationState = initialState, action: AuthAction) {
    switch (action.type) {
        case userConstants.LOGIN_REQUEST:
            return {
                loggingIn: true,
                user: action.user
            };
        case userConstants.LOGIN_SUCCESS:
            return {
                loggedIn: true,
                user: action.user,
                token: action.token
            };
        case userConstants.LOGIN_FAILURE:
            return {};
        case userConstants.LOGOUT:
            return {};
        default:
            return state
    }
}
