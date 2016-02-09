import {simpleAction} from '../helpers/util';

export const LOAD_STATE = 'LOAD_STATE';

export const loadState = simpleAction(LOAD_STATE, 'state');
