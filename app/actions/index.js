import {simpleAction} from '../helpers/util';
import * as socket from '../middleware/socket';

export const LOAD_STATE = 'LOAD_STATE';
export const SET_CLIENT = 'SET_CLIENT';

export const CONNECT = 'CONNECT';

export const loadState = simpleAction(LOAD_STATE, 'state');
export const setClient = simpleAction(SET_CLIENT, 'client');

/** SOCKET API **/

export function connect(url) {
    return {
        type: CONNECT,
        url,
        [socket.CONNECT]: url
    }
}
