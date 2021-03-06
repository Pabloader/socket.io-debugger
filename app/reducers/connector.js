import {Set, Map} from "immutable";
import {createReducer} from "../helpers/util";
import * as actions from "../actions";

export default createReducer({
    [actions.LOAD_STATE](state, {state: {connector}}) {
        let history;
        if (connector.history) {
            history = Set.of(...connector.history);
        } else {
            history = Set.of();
        }
        return state.merge({
            history
        }).set('lastValue', connector.lastValue);
    },
    [actions.CONNECT](state, {url}) {
        let history = state.get('history');
        if (!history) {
            history = Set.of();
        }
        history = history.add(url);
        return state.merge({
            history
        }).set('lastValue', url).set('open', false);
    },
    [actions.SET_CLIENT](state, {client}) {
        return state.set('client', client);
    },
    [actions.NEW_CONNECTION](state) {
        return state.set('open', true);
    }
}, Map({open: true}));
