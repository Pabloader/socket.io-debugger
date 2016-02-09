import {fromJS, List, Map} from 'immutable';
import {createReducer} from '../helpers/util';
import * as actions from '../actions';

export default createReducer({
    [actions.ADD_EVENT](state, {eventType, content}) {
        let events = state.get('events');
        if (!events) {
            events = List.of();
        }
        let event = {
            type: eventType,
            id: events.count(),
            content
        };
        events = events.push(event);
        return state.merge({events});
    }
}, Map());
