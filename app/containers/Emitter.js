import React, {Component, PropTypes} from "react";
import {AutoComplete, TableRow, TableRowColumn, IconButton, TextField} from "material-ui";
import ArrowUpward from "material-ui/lib/svg-icons/navigation/arrow-upward";
import Code from "material-ui/lib/svg-icons/action/code";
import {connect} from "react-redux";
import {List} from "immutable";
import ExtendedEmitter from "../components/ExtendedEmitter";
import * as actions from "../actions";

class Emitter extends Component {
    state = {
        open: false,
    };

    openExtendedEmitter() {
        this.setState({open: true});
    }

    closeExtendedEmitter() {
        this.setState({open: false});
    }

    render() {
        let {lastValue} = this.props;
        var dataSource = this._prepareDataSource();
        return (
            <TableRow selectable={false}>
                <TableRowColumn title="Send" width="5%">
                    <IconButton onClick={e => this.doEmit()}>
                        <ArrowUpward/>
                    </IconButton>
                </TableRowColumn>
                <TableRowColumn>
                    <AutoComplete
                        ref="type"
                        hintText="Event name"
                        dataSource={dataSource}
                        searchText={lastValue && lastValue.eventType}
                        triggerUpdateOnFocus={true}
                        autoComplete="off"
                        fullWidth={true}
                        onKeyUp={e => e.keyCode === 13 && this.doEmit()}
                    />
                </TableRowColumn>
                <TableRowColumn>
                    <TextField
                        hintText="String will be used as first argument for event"
                        fullWidth={true}
                        ref="text"
                        onKeyUp={e => e.keyCode === 13 && this.doEmit()}
                    />
                </TableRowColumn>
                <TableRowColumn width="5%">
                    <IconButton title="Extended" onClick={() => this.openExtendedEmitter()}>
                        <Code/>
                    </IconButton>
                    <ExtendedEmitter
                        handleClose={() => this.closeExtendedEmitter()}
                        open={this.state.open}
                        onEmit={this.onExtendedEmit.bind(this)}
                        dataSource={dataSource}
                        searchText={lastValue && lastValue.eventType}
                    />
                </TableRowColumn>
            </TableRow>
        );
    }

    doEmit() {
        this.onEmit(this.refs.type.getValue(), this.refs.text.getValue());
    }

    _prepareDataSource() {
        let {history} = this.props;
        return [...new Set(history.toJS()
            .filter(h=>h)
            .map(({eventType}) => eventType))];
    }

    onEmit(type, text) {
        let {dispatch} = this.props;
        dispatch(actions.emit(type, text));
    }

    onExtendedEmit(type, args, cb) {
        let {dispatch} = this.props;
        this.closeExtendedEmitter();
        if (cb) {
            var callback = function (...callbackArgs) {
                dispatch(actions.addEvent('callback:' + type, callbackArgs, true));
            };
            callback.toString = () => 'function() { /* code hidden */ }';
            args.push(callback);
        }
        dispatch(actions.emit(type, ...args));
    }
}

Emitter.propTypes = {
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.instanceOf(List),
    lastValue: PropTypes.object
};

function mapStateToProps(state) {
    const emitter = state.emitter;
    let history = emitter.get('history');
    let lastValue = emitter.get('lastValue');
    if (!history) history = List.of();
    return {history, lastValue, open};
}

export default connect(mapStateToProps)(Emitter);

