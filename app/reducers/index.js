import {combineReducers} from 'redux';
import connector from './connector';
import timeline from './timeline';
import emitter from './emitter';

const rootReducer = combineReducers({
    connector,
    timeline,
    emitter
});

export default rootReducer;
