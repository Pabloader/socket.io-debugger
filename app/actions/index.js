import {simpleAction} from '../helpers/util';

export * from './emitter';
export * from './connector';

export const LOAD_STATE = 'LOAD_STATE';
export const SET_CLIENT = 'SET_CLIENT';

export const ADD_EVENT = 'ADD_EVENT';

export const loadState = simpleAction(LOAD_STATE, 'state');
export const setClient = simpleAction(SET_CLIENT, 'client');
export const addEvent = simpleAction(ADD_EVENT, 'eventType', 'content', 'incoming');
