import {simpleAction} from '../helpers/util';
import * as socket from '../middleware/socket';

export const EMIT = 'EMIT';
export const ADD_TEMPLATE = 'ADD_TEMPLATE';

export function emit(type, ...args) {
    return {
        type: EMIT,
        eventType: type,
        args,
        [socket.EMIT]: {
            type, args
        }
    }
}

export const addTemplate = simpleAction(ADD_TEMPLATE, 'eventType', 'args', 'callbackUsed', 'name');
