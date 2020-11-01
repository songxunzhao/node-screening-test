import { UserModel } from "./user.model";

export interface DepositModel {
    id: string;
    bankName: string;
    accountNumber: string;
    initialAmount: number;
    startDate: Date;
    endDate: Date;
    interestPercentage: number;
    taxesPercentage: number;
    user?: UserModel;
    userId: string;
}

export function depositModelFromJson(json: any): DepositModel {
    return Object.assign({}, json, {
        startDate: new Date(json.startDate),
        endDate: new Date(json.endDate)
    })
}
