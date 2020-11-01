import {User} from './user';

export interface Revenue {
    id: number;
    bankName: string;
    accountNumber: string;
    initialAmount: number;
    startDate: Date;
    endDate: Date;
    interestPercentage: number;
    taxesPercentage: number;
    change: number;
    from: string;
    to: string;
    user?: User;
    userId: number;
}

