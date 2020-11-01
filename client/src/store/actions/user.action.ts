import {userConstants} from "../constants";
import {ThunkDispatch} from 'redux-thunk';
import { history } from '../../helpers';
import accountService, {LoginResponseModel} from '../../services/account.service';
import usersService from '../../services/users.service';
import { UserModel } from "../../models";
import {alertActions} from "./alert.action";
import {authStorage} from "../../services";

export const userActions = {
    login,
    logout,
    register,
    getAll,
    delete: _delete
};

function login(email: string, password: string) {
    return (dispatch:ThunkDispatch<any, any, any>) => {
        dispatch(request({ email }));

        accountService.login(email, password)
            .then(
                (loginResponse: LoginResponseModel) => {
                    const { user, token } = loginResponse;
                    dispatch(success(user, token));
                    authStorage.save({
                        user,
                        token
                    })
                    history.push('/');
                },
                error => {
                    console.log(error);
                    dispatch(failure(error));
                    dispatch(alertActions.error(error.message));
                })
    };

    function request(user: UserModel) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user: UserModel, token: string) { return { type: userConstants.LOGIN_SUCCESS, user, token } }
    function failure(error: Error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout() {
    accountService.logout();
    return { type: userConstants.LOGOUT };
}

function register(user: UserModel) {
    return (dispatch: ThunkDispatch<any, any, any>) => {
        dispatch(request(user));

        accountService.register(user)
            .then(
                response => {
                    dispatch(success(user));
                    history.push('/login');
                    dispatch(alertActions.success('Registration successful'));
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            );
    };

    function request(user: UserModel) { return { type: userConstants.REGISTER_REQUEST, user } }
    function success(user: UserModel) { return { type: userConstants.REGISTER_SUCCESS, user } }
    function failure(error: Error) { return { type: userConstants.REGISTER_FAILURE, error } }
}

function getAll() {
    return (dispatch: ThunkDispatch<any, any, any>) => {
        dispatch(request());

        usersService.getAll()
            .then(
                (users: UserModel[]) => dispatch(success(users)),
                (error: Error) => dispatch(failure(error))
            );
    };

    function request() { return { type: userConstants.GETALL_REQUEST } }
    function success(users: UserModel[]) { return { type: userConstants.GETALL_SUCCESS, users } }
    function failure(error: Error) { return { type: userConstants.GETALL_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id: string) {
    return (dispatch: ThunkDispatch<any, any, any>) => {
        dispatch(request(id));

        usersService.delete(id)
            .then(
                user => {
                    dispatch(success(id));
                },
                error => {
                    dispatch(failure(id, error));
                }
            );
    };

    function request(id: string) { return { type: userConstants.DELETE_REQUEST, id } }
    function success(id: string) { return { type: userConstants.DELETE_SUCCESS, id } }
    function failure(id: string, error: Error) { return { type: userConstants.DELETE_FAILURE, id, error } }
}
