import { alertConstants } from '../constants/alert.constants'
import {Action} from 'redux';

export interface AlertState {
    type?: "success"|"error"|undefined,
    message?: string
}
export interface AlertAction extends Action {
    message: string;
}

export function alert(state: AlertState = {}, action: AlertAction) {
    switch (action.type) {
        case alertConstants.SUCCESS:
            return {
                type: 'success',
                message: action.message
            };
        case alertConstants.ERROR:
            return {
                type: 'error',
                message: action.message
            };
        case alertConstants.CLEAR:
            return {};
        default:
            return state
    }
}
