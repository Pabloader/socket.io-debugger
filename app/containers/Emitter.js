import React, {Component, PropTypes} from 'react';
import {Dialog, RaisedButton, AutoComplete} from 'material-ui';
import {connect} from 'react-redux';
import {List} from 'immutable';

import * as actions from '../actions';

class Emitter extends Component {
    constructor() {
        super(...arguments);
    }

    render() {
        let {history, lastValue, open} = this.props;
        let actions = [
            <RaisedButton
                label="emit"
                primary={true}
                onClick={e => this.onEmit(this.refs.type.getValue())}
                />
        ];
        return (
            <div>
                <Dialog
                    title="Emit event"
                    actions={actions}
                    open={open}>
                    <AutoComplete
                        ref="type"
                        hintText="ping"
                        dataSource={history.toJS().filter(h=>h).map(({eventType}) => eventType)}
                        searchText={lastValue && lastValue.eventType}
                        triggerUpdateOnFocus={true}
                        autoComplete="off"
                        />
                </Dialog>
            </div>
        );
    }

    onEmit(type) {
        let {dispatch} = this.props;
        dispatch(actions.closeEmitter());
        dispatch(actions.emit(type));
    }
}

Emitter.propTypes = {
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.instanceOf(List),
    lastValue: PropTypes.object,
    open: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
    const emitter = state.emitter;
    let history = emitter.get('history');
    let lastValue = emitter.get('lastValue');
    let open = emitter.get('open');
    if (!history) history = List.of();
    return {history, lastValue, open};
}

export default connect(mapStateToProps)(Emitter);

