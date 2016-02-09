import {simpleAction} from '../helpers/util';
import * as socket from '../middleware/socket';

export const LOAD_STATE = 'LOAD_STATE';
export const SET_CLIENT = 'SET_CLIENT';

export const CONNECT = 'CONNECT';

export const ADD_EVENT = 'ADD_EVENT';

export const loadState = simpleAction(LOAD_STATE, 'state');
export const setClient = simpleAction(SET_CLIENT, 'client');
export const addEvent = simpleAction(ADD_EVENT, 'eventType', 'content');

/** SOCKET API **/

export function connect(url) {
    return {
        type: CONNECT,
        url,
        [socket.CONNECT]: url
    }
}
