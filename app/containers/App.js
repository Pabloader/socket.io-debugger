import React, {Component, PropTypes} from 'react';
import Connector from './Connector.js';
import TimeLine from './TimeLine.js';
import Emitter from './Emitter.js';
import {connect} from 'react-redux';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import Launch from 'material-ui/lib/svg-icons/action/launch';
import * as actions from '../actions'

class App extends Component {
    render() {
        let {dispatch} = this.props;
        let style = {
            position: 'fixed',
            bottom: '20px',
            right: '20px'
        };
        return (
            <div>
                <Connector />
                <TimeLine />
                <FloatingActionButton style={style} onClick={e => dispatch(actions.openEmitter())}>
                    <Launch />
                </FloatingActionButton>
                <Emitter ref="emitter"/>
            </div>
        );
    }
}

App.propTypes = {
    dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps)(App);
