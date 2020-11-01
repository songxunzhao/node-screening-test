import { UserModel } from "../models/user.model";

const authStorage = {
    save,
    load,
    clear
}

export interface AuthStoreModel {
    user: UserModel;
    token: string
}

function save(authData: AuthStoreModel) {
    const {user, token} = authData;
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
}

function load(): AuthStoreModel|null {
    const userJson = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if(userJson && token) {
        return {
            user: JSON.parse(userJson),
            token
        }
    } else {
        return null;
    }
}

function clear(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
}

export { authStorage }
