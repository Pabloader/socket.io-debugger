import * as actions from '../actions';
import defaultClient from 'socket.io-client';
import {getScript} from 'jquery';
import {parseURL} from '../helpers/util.js';

export const CONNECT = Symbol('Connect');

const events = [
    "connect",
    "connect_error",
    "connect_timeout",
    "connecting",
    "disconnect",
    "error",
    "reconnect",
    "reconnect_attempt",
    "reconnect_failed",
    "reconnect_error",
    "reconnecting",
    "ping",
    "pong"
];

const apiHandlers = {
    [CONNECT](url, store) {
        let {origin} = parseURL(url);
        store.dispatch(actions.addEvent('connection_request', {url}, true));
        getScript(`${origin}/socket.io/socket.io.js`).then(() => {
            initClient(window.io || defaultClient, url, store.dispatch);
            store.dispatch(actions.addEvent('download_success', {url}, true));
        }, error => {
            initClient(defaultClient, url, store.dispatch);
            store.dispatch(actions.addEvent('download_error', {url, error}, true));
        })
    }
};

function initClient(io, url, dispatch) {
    let socket = io.connect(url);
    if (socket.onevent) {
        let oldOnEvent = socket.onevent;
        socket.onevent = (packet, ...args) => {
            let {data} = packet;
            let [type, ...eventArgs] = data;
            dispatch(actions.addEvent(type, eventArgs, true));
            oldOnEvent.call(socket, packet, ...args);
        }
    } else if (socket.$emit) {
        let oldEmit = socket.$emit;
        socket.$emit = (type, ...args) => {
            dispatch(actions.addEvent(type, args, true));
            oldEmit.call(socket, type, ...args);
        };
    }
    for(let type of events) {
        socket.on(type, (...args) => {
            dispatch(actions.addEvent(type, args, true));
        })
    }
}

export default store => next => action => {
    console.log(action);
    for (let symbol of Object.getOwnPropertySymbols(apiHandlers)) {
        let handler = apiHandlers[symbol];
        let actionData = action[symbol];
        if (actionData) {
            delete action[symbol];
            handler(actionData, store);
        }
    }
    if (action.type) {
        return next(action);
    }
}
