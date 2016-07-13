import React, {Component, PropTypes} from "react";
import {AutoComplete, TableRow, TableRowColumn, IconButton} from "material-ui";
import ArrowUpward from "material-ui/lib/svg-icons/navigation/arrow-upward";
import {connect} from "react-redux";
import {List} from "immutable";
import * as actions from "../actions";

class Emitter extends Component {
    constructor() {
        super(...arguments);
    }

    render() {
        let {lastValue} = this.props;
        return (
            <TableRow selectable={false}>
                <TableRowColumn title="Send" width="5%">
                    <IconButton onClick={e => this.onEmit(this.refs.type.getValue())}>
                        <ArrowUpward/>
                    </IconButton>
                </TableRowColumn>
                <TableRowColumn>
                    <AutoComplete
                        ref="type"
                        hintText="ping"
                        dataSource={this._prepareDataSource()}
                        searchText={lastValue && lastValue.eventType}
                        triggerUpdateOnFocus={true}
                        autoComplete="off"
                        fullWidth={true}
                    />
                </TableRowColumn>
                <TableRowColumn>

                </TableRowColumn>
            </TableRow>
        );
    }

    _prepareDataSource() {
        let {history} = this.props;
        return [...new Set(history.toJS()
            .filter(h=>h)
            .map(({eventType}) => eventType))];
    }

    onEmit(type) {
        let {dispatch} = this.props;
        dispatch(actions.emit(type));
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

