import httpService from './http.service';
import { ResponseDataModel } from "../models";
import {DepositModel, depositModelFromJson} from "../models";
import {RevenueModel, revenueModelFromJson} from "../models";

class DepositsService {
    public async search(searchOptions: {[key:string]: any}): Promise<DepositModel[]> {
        const queryParams = Object.keys(searchOptions).map(key => {
            return `${key}=${searchOptions[key]}`;
        })
        const queryStr = queryParams.join('&');

        const url = '/deposits/?' + queryStr;
        const response: Response = await httpService.get(url, {});
        if(response.ok) {
            const responseData:ResponseDataModel = await response.json()
            return responseData.result.map(
                (value: DepositModel) => depositModelFromJson(value)
            )
        } else {
            throw new Error('Server error')
        }
    }
    public async revenue(period: {from: string, to: string}): Promise<RevenueModel[]> {
        const queryStr = `from=${period.from}&to=${period.to}`

        const url = '/deposits/revenue?' + queryStr;
        const response: Response = await httpService.get(url, {});
        if(response.ok) {
            const responseData:ResponseDataModel = await response.json()
            return responseData.result.map(
                (value: any) => revenueModelFromJson(value)
            )
        } else {
            throw new Error('Server error')
        }
    }

    public async get(id: string): Promise<DepositModel> {
        const url = `/deposits/${id}`;

         const response = await httpService.get(url, {});

         if(response.ok) {
             const responseData: ResponseDataModel = await response.json();
             return depositModelFromJson(responseData.result)
         }
         else if(response.status < 500) {
            const responseData: ResponseDataModel = await response.json();
            throw new Error(responseData.message)
         } else {
            throw new Error('Server error')
         }
    }

    public async create(deposit: any): Promise<Response> {
        const url = '/deposits/';
        const response = await httpService.post(url, {}, deposit);
        if(response.ok) {
            return response
        } else if(response.status < 500) {
            const responseData: ResponseDataModel = await response.json();
            throw new Error(responseData.message)
        } else {
            throw new Error('Server error')
        }
    }

    public async update(id: string, deposit: any): Promise<Response> {
        const url = `/deposits/${id}`;
        const response = await httpService.put(url, {}, deposit);
        if(response.ok) {
            return response
        } else if(response.status < 500) {
            const responseData: ResponseDataModel = await response.json();
            throw new Error(responseData.message)
        } else {
            throw new Error('Server error')
        }
    }

    public async delete(id: string): Promise<Response> {
        const url = `/deposits/${id}`;
        const response = await httpService.delete(url, {});
        if(response.ok) {
            return response
        } else if(response.status < 500) {
            const responseData: ResponseDataModel = await response.json();
            throw new Error(responseData.message)
        } else {
            throw new Error('Server error')
        }
    }
}

export default new DepositsService();
