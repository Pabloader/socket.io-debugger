import {simpleAction} from "../helpers/util";
import * as socket from "../middleware/socket";

export const EMIT = 'EMIT';
export const EXECUTE = 'EXECUTE';
export const ADD_TEMPLATE = 'ADD_TEMPLATE';
export const REMOVE_TEMPLATE = 'REMOVE_TEMPLATE';
export const ADD_SCRIPT = 'ADD_SCRIPT';
export const REMOVE_SCRIPT = 'REMOVE_SCRIPT';

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

export function executeScript(script) {
    return {
        type: EXECUTE,
        script,
        [socket.EXECUTE]: {
            script
        }
    }
}

export const addTemplate = simpleAction(ADD_TEMPLATE, 'eventType', 'args', 'callbackUsed', 'name');
export const removeTemplate = simpleAction(REMOVE_TEMPLATE, 'id');
export const addScript = simpleAction(ADD_SCRIPT, 'name', 'script', 'id', 'server');
export const removeScript = simpleAction(REMOVE_SCRIPT, 'id');
