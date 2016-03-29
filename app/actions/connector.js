import {simpleAction} from '../helpers/util';
import * as socket from '../middleware/socket';

export const CONNECT = 'CONNECT';

export function connect(url) {
    return {
        type: CONNECT,
        url,
        [socket.CONNECT]: url
    }
}
