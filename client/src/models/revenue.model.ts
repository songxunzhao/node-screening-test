import { UserModel } from "./user.model";

export interface RevenueModel {
    id: string;
    bankName: string;
    accountNumber: string;
    initialAmount: number;
    startDate: Date;
    endDate: Date;
    interestPercentage: number;
    taxesPercentage: number;
    change: number;
    from: Date;
    to: Date;
    user?: UserModel;
    userId: string;
}

export function revenueModelFromJson(json: any): RevenueModel {
    return Object.assign({}, json, {
        startDate: new Date(json.startDate),
        endDate: new Date(json.endDate)
    })
}
