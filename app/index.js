import './styles.css';

import React from 'react';
import {render} from 'react-dom';

import Immutable from 'immutable';

import Root from './containers/Root';
import configureStore from './store/configureStore';

import storage from 'store';
import * as actions from './actions';

const store = configureStore();
const app = document.createElement('div');
document.body.appendChild(app);

let injectTapEventPlugin = require('react-tap-event-plugin');

// inject tap for material-ui
injectTapEventPlugin();

render(<Root store={store}/>, app);

const state = storage.get('state');
if (state) {
    store.dispatch(actions.loadState(state));
}
store.subscribe(
    () => {
        let immutableState = Immutable.fromJS(store.getState());
        immutableState = immutableState.deleteIn(['connector', 'client']);
        if (immutableState) {
            storage.set('state', immutableState.toJS());
        }
    }
);
