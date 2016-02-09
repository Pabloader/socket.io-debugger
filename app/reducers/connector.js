import {fromJS, List, Map} from 'immutable';
import {createReducer} from '../helpers/util';
import * as actions from '../actions';

export default createReducer({
    [actions.LOAD_STATE](state, {state: {connector}}) {
        let history;
        if (connector.history) {
            history = List.of(...connector.history);
        } else {
            history = List.of();
        }
        return state.merge({
            history
        });
    },
    [actions.CONNECT](state, {url}) {
        let history = state.get('history');
        if (!history) {
            history = List.of();
        }
        history = history.push(url);
        return state.merge({
            history
        });
    },
}, Map());
