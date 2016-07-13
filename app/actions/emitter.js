import {simpleAction} from '../helpers/util';
import * as socket from '../middleware/socket';

export const EMIT = 'EMIT';

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
