import {store} from '../store'
import {history} from '../helpers/history'
import {userActions} from "../store/actions/user.action";

class HttpService {
    private BASE_URL = '/api/v1'
    private getAuthHeader(): {} {
        const token = localStorage.getItem('token');

        if (token) {
            return { 'Auth': token };
        } else {
            return {};
        }
    }

    public get(url: string, headers: {} = {}): Promise<Response> {
        const requestOptions = {
            method: 'GET',
            headers
        }

        return this.fetch(url, requestOptions);
    }

    public post(url: string, headers: {} = {}, data: any = {}): Promise<Response> {
        const requestOptions = {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        }
        return this.fetch(url, requestOptions);
    }

    public put(url: string, headers: {} = {}, data: any): Promise<Response> {
        const requestOptions = {
            method: 'PUT',
            headers,
            body: JSON.stringify(data)
        }

        return this.fetch(url, requestOptions);
    }

    public delete(url: string, headers: {}): Promise<Response> {
        const requestOptions = {
            method: 'DELETE',
            headers
        }

        return this.fetch(url, requestOptions);
    }

    public async fetch(url: string, requestOptions: any): Promise<Response> {
        requestOptions.headers = requestOptions.headers ?? {};
        requestOptions.headers = Object.assign({
            'Content-Type': 'application/json'
        }, this.getAuthHeader());

        const response = await fetch(this.BASE_URL + url, requestOptions);
        if(response.status === 401) {
            store.dispatch(userActions.logout())
            history.push('/')
        }
        return response
    }
}

export default new HttpService();
