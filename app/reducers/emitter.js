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
    [actions.EMIT](state, data) {
        let history = state.get('history');
        if (!history) {
            history = List.of();
        }
        history = history.push(data);
        return state.merge({
            history
        }).set('lastValue', data);
    },
    [actions.OPEN_EMITTER](state) {
        return state.set('open', true);
    },
    [actions.CLOSE_EMITTER](state) {
        return state.set('open', false);
    }
}, Map({
    open: false
}));
