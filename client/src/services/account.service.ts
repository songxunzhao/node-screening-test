import httpService from './http.service';
import { UserModel } from "../models";
import {authStorage} from "./storage.service";

export interface LoginResponseModel {
    user: UserModel,
    token: string
}

class AccountService {
    public async login(email: string, password: string): Promise<LoginResponseModel> {
        const response: Response = await httpService.post('/account/login', {}, {
            email,
            password
        });

        if(response.ok) {
            const responseData = await response.json()
            return responseData.result;
        } else if(response.status === 401) {
            const responseData = await response.json()
            throw new Error(responseData.message)
        } else {
            throw new Error('Server error')
        }

    }

    public logout() {
        authStorage.clear();
    }

    public register(user: {[key: string]: any}): Promise<Response> {
        return httpService.post('/account/register', {}, user);
    }
}

export default new AccountService();
