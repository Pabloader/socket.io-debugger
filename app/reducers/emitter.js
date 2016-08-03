import {List, Set, Map} from "immutable";
import {createReducer} from "../helpers/util";
import * as actions from "../actions";

export default createReducer({
    [actions.LOAD_STATE](state, {state: {emitter}}) {
        let history, templates;
        if (emitter.history && typeof emitter.history[0] === 'string') {
            history = Set.of(...emitter.history);
        } else {
            history = Set.of();
        }
        if (emitter.templates) {
            templates = List.of(...emitter.templates);
        } else {
            templates = List.of();
        }
        return state.merge({
            history, templates
        }).set('lastValue', emitter.lastValue);
    },
    [actions.EMIT](state, {eventType}) {
        let history = state.get('history');
        if (!history) {
            history = Set.of();
        }
        history = history.add(eventType);
        return state.merge({
            history
        }).set('lastValue', eventType);
    },
    [actions.ADD_TEMPLATE](state, data) {
        let templates = state.get('templates');
        if (!templates) {
            templates = List.of();
        }
        templates = templates.push(data);
        return state.merge({
            templates
        });
    },
    [actions.REMOVE_TEMPLATE](state, {id}) {
        let templates = state.get('templates');
        if (!templates) {
            templates = List.of();
        }
        templates = templates.filter(template => template.id != id);
        return state.merge({
            templates
        });
    }
}, Map());
