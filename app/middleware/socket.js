import * as actions from '../actions';
import defaultClient from 'socket.io-client';
import {getScript} from 'jquery';
import {parseURL} from '../helpers/util.js';

export const CONNECT = Symbol('Connect');

const apiHandlers = {
    [CONNECT](url, store) {
        let {origin} = parseURL(url);
        getScript(`${origin}/socket.io/socket.io.js`).then(() => {
            initClient(window.io || defaultClient, url, store.dispatch);
            store.dispatch(actions.addEvent('download_success', {url}));
        }, error => {
            initClient(defaultClient, url, store.dispatch);
            store.dispatch(actions.addEvent('download_error', {url, error}));
        })
    }
};

function initClient(io, url, dispatch) {
    let socket = io(url);
    let oldEmit = socket.$emit;
    socket.$emit = (type, ...args) => {
        dispatch(actions.addEvent(type, args));
        oldEmit.call(socket, type, ...args);
    };
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
