import React, {Component, PropTypes} from "react";
import {Dialog, FlatButton, AutoComplete} from "material-ui";
import {connect} from "react-redux";
import {Set} from "immutable";
import {parseURL} from "../helpers/util.js";
import * as actions from "../actions";

class Connector extends Component {
    render() {
        let {lastValue, open} = this.props;
        let actions = [
            <FlatButton
                label="connect"
                primary={true}
                onClick={e => this.doConnect()}
            />
        ];
        return (
            <Dialog
                title="Connect"
                actions={actions}
                open={open}>
                <AutoComplete
                    ref="url"
                    hintText="http://localhost:1234/namespace"
                    fullWidth={true}
                    dataSource={this._prepareDataSource()}
                    searchText={lastValue}
                    triggerUpdateOnFocus={true}
                    autoComplete="off"
                    onKeyUp={e => e.keyCode === 13 && this.doConnect()}
                />
            </Dialog>
        );
    }

    onURL(url) {
        url = parseURL(url).href;
        if (!url) {
            return;
        }
        let {dispatch} = this.props;
        dispatch(actions.connect(url));
    }

    doConnect() {
        this.onURL(this.refs.url.getValue());
    }

    _prepareDataSource() {
        let {history} = this.props;
        return history.toJS().filter(Boolean);
    }
}

Connector.propTypes = {
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.instanceOf(Set),
    lastValue: PropTypes.string,
    open: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
    const connector = state.connector;
    let history = connector.get('history');
    let lastValue = connector.get('lastValue');
    let open = connector.get('open');
    if (!history) history = Set.of();
    return {history, lastValue, open};
}

export default connect(mapStateToProps)(Connector);

