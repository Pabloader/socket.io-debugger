import {List, Set, Map} from "immutable";
import {createReducer} from "../helpers/util";
import * as actions from "../actions";

export default createReducer({
    [actions.LOAD_STATE](state, {state: {emitter}}) {
        let history, templates, scripts;
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
        if (emitter.scripts) {
            scripts = List.of(...emitter.scripts);
        } else {
            scripts = List.of();
        }
        return state.merge({
            history, templates, scripts
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
        if (!data.id) {
            data.id = templates.count() + 1;
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
    },
    [actions.ADD_SCRIPT](state, data) {
        let scripts = state.get('scripts');
        if (!scripts) {
            scripts = List.of();
        }
        let idx = scripts.findIndex(script => script.id == data.id);
        if (idx >= 0) {
            let script = scripts.get(idx);
            scripts = scripts.set(Object.assign(script, data));
        } else {
            data.id = scripts.count() + 1;
            scripts = scripts.push(data);
        }
        return state.merge({
            scripts
        });
    },
    [actions.REMOVE_SCRIPT](state, {id}) {
        let scripts = state.get('scripts');
        if (!scripts) {
            scripts = List.of();
        }
        scripts = scripts.filter(script => script.id != id);
        return state.merge({
            scripts
        });
    }
}, Map());
