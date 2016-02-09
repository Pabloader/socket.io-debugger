import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import reducer from '../reducers';
import socket from '../middleware/socket.js'

const finalCreateStore = compose(
    applyMiddleware(thunk, socket),
    window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

export default function configureStore(initialState) {
    return finalCreateStore(reducer, initialState);
}
