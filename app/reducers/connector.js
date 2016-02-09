import {fromJS, List, Map} from 'immutable';
import {createReducer} from '../helpers/util';
import * as actions from '../actions';

export default createReducer({
    [actions.LOAD_STATE](state, {state: {history}}) {
        history = List.of(history);
        return state.merge({
            history
        });
    },
}, Map());
