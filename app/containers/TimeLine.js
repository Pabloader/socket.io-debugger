import React, {Component, PropTypes} from 'react';
import {Dialog, RaisedButton, AutoComplete} from 'material-ui';
import {connect} from 'react-redux';
import {List} from 'immutable';
import {parseURL} from '../helpers/util.js';
import TimeLineItem from '../components/TimeLineItem.js';

import * as actions from '../actions';

class TimeLine extends Component {
    render() {
        let {events} = this.props;
        return (
            <div className="timeline" ref="timeline">
                {events.map(event => <TimeLineItem key={event.id} event = {event}/>)}
            </div>
        );
    }
    componentDidUpdate() {
        let {timeline} = this.refs;
        if(timeline){
           timeline.scrollTop = timeline.scrollHeight;
        }
    }
}

TimeLine.propTypes = {
    dispatch: PropTypes.func.isRequired,
    events: PropTypes.instanceOf(List).isRequired
};

function mapStateToProps(state) {
    const timeline = state.timeline;
    let events = timeline.get('events');
    if (!events) events = List.of();
    return {events};
}

export default connect(mapStateToProps)(TimeLine);

