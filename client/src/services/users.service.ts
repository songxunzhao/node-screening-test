import httpService from './http.service';
import { UserModel } from '../models';
import { ResponseDataModel } from '../models';

class UsersService {
    public async getAll(): Promise<UserModel[]> {
        const url = '/users/';
        const response: Response = await httpService.get(url, {});
        if(response.ok) {
            const responseData: ResponseDataModel = await response.json();
            return responseData.result;
        } else {
            throw new Error('Server error')
        }
    }

    public async get(id: string): Promise<UserModel> {
        const url = `/users/${id}`;
        const response: Response = await httpService.get(url, {});
        const responseData: ResponseDataModel = await response.json();
        return responseData.result;
    }

    public async create(user: any): Promise<UserModel> {
        const url = '/users/';
        const response: Response = await httpService.post(url, {}, user);
        const responseData: ResponseDataModel = await response.json();
        return responseData.result;
    }

    public async update(id: string, user: any): Promise<UserModel> {
        const url = `/users/${id}`;
        const response: Response = await httpService.put(url, {}, user);
        const responseData: ResponseDataModel = await response.json();
        return responseData.result;
    }

    public delete(id: string): Promise<Response> {
        const url = `/users/${id}`;
        return httpService.delete(url, {});

    }
}

export default new UsersService();
