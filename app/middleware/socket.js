import * as actions from '../actions';
import defaultClient from 'socket.io-client';
import {getScript} from 'jquery';


export const CONNECT = Symbol('Connect');

const apiHandlers = {
    [CONNECT](actionData, store) {

    }
};

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
