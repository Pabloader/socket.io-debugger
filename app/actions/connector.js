import * as socket from "../middleware/socket";

export const CONNECT = 'CONNECT';
export const NEW_CONNECTION = 'NEW_CONNECTION';

export function connect(url) {
    return {
        type: CONNECT,
        url,
        [socket.CONNECT]: url
    }
}

export function newConnection() {
    return {
        type: NEW_CONNECTION,
        [socket.DISCONNECT]: true
    }
}
