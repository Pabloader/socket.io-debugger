import {List, Map} from "immutable";
import {createReducer} from "../helpers/util";
import * as actions from "../actions";

export default createReducer({
    [actions.LOAD_STATE](state, {state: {emitter}}) {
        let history;
        if (emitter.history) {
            history = List.of(...emitter.history);
        } else {
            history = List.of();
        }
        return state.merge({
            history
        }).set('lastValue', emitter.lastValue);
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
    }
}, Map());
