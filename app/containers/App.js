import React, {Component, PropTypes} from 'react';
import Connector from './Connector.js';
import {connect} from 'react-redux';

class App extends Component {
    render() {
        return (
            <div>
                <Connector />
            </div>
        );
    }
}

App.propTypes = {
    dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    return {};;
}

export default connect(mapStateToProps)(App);
