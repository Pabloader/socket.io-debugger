import React, {Component, PropTypes} from 'react';
import {Dialog, RaisedButton, AutoComplete} from 'material-ui';
import {connect} from 'react-redux';
import {Set} from 'immutable';
import {parseURL} from '../helpers/util.js';

import * as actions from '../actions';

class Connector extends Component {
    constructor() {
        super(...arguments);
        this.state = {open: true};
    }

    render() {
        let {open} = this.state;
        let {history} = this.props;
        let lastValue = '';
        if(history.count() > 0) {
            lastValue = history.last();
        }
        let actions = [
            <RaisedButton
                label="connect"
                primary={true}
                onClick={e => this.onURL(this.refs.url.getValue())}
                />
        ];
        return (
            <div>
                <Dialog
                    title="Connect"
                    actions={actions}
                    open={open}>
                    <AutoComplete
                        ref="url"
                        hintText="http://localhost:1234/namespace"
                        fullWidth={true}
                        dataSource={history.toJS()}
                        searchText={lastValue}
                        triggerUpdateOnFocus={true}
                        autoComplete="off"
                        />
                </Dialog>
            </div>
        );
    }
    onURL(url) {
        url = parseURL(url).href;
        if(!url) {
            return;
        }
        this.setState({open: false});
        let {dispatch} = this.props;
        dispatch(actions.connect(url));
    }
}

Connector.propTypes = {
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.instanceOf(Set)
};

function mapStateToProps(state) {
    const connector = state.connector;
    let history = connector.get('history');
    if(!history) history = Set.of();
    return {history};
}

export default connect(mapStateToProps)(Connector);

