import {simpleAction} from '../helpers/util';
import * as socket from '../middleware/socket';

export const OPEN_EMITTER = 'OPEN_EMITTER';
export const CLOSE_EMITTER = 'CLOSE_EMITTER';

export const EMIT = 'EMIT';

export const openEmitter = simpleAction(OPEN_EMITTER);
export const closeEmitter = simpleAction(CLOSE_EMITTER);

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
