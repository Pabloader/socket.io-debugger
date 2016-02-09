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

render(<Root store={store}/>, app);

const state = storage.get('state');
if (state) {
    store.dispatch(actions.loadState(state));
}
store.subscribe(
    () => {
        const immutableState = Immutable.fromJS(store.getState());
        if (immutableState) {
            storage.set('state', immutableState.toJS());
        }
    }
);
