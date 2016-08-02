import React, {Component, PropTypes} from "react";
import {Dialog, FlatButton, AutoComplete, Tabs, Tab, TextField} from "material-ui";
import {connect} from "react-redux";
import {Set} from "immutable";
import {parseURL} from "../helpers/util.js";
import * as actions from "../actions";

const CONNECT = 'Connect';
const LISTEN = 'Listen';

class Connector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: CONNECT
        };
    }

    render() {
        let {lastValue, open} = this.props;
        let actions = [
            <FlatButton
                label={this.state.type}
                primary={true}
                onClick={e => this.doConnect()}
            />
        ];
        return (
            <Dialog
                title={this.state.type}
                actions={actions}
                open={open}>
                <Tabs value={this.state.type}
                      onChange={type => typeof(type) === 'string' && this.setState({type})}>
                    <Tab label="Debug server" value={CONNECT}>
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
                    </Tab>
                    <Tab label="Debug client" value={LISTEN}>
                        <TextField
                            hintText="/namespace"
                            fullWidth={true}
                        />
                    </Tab>
                </Tabs>
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
        if (this.state.type === 'Connect') {
            this.onURL(this.refs.url.getValue());
        } else if (this.state.type === LISTEN) {

        }

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

