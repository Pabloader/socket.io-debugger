import React, {Component, PropTypes} from 'react';
import {Paper} from 'material-ui';

export default class TimeLineItem extends Component {
    render() {
        let {event} = this.props;
        let content = ''; //todo parsing content
        let titleStyle = {
            textAlign: event.incoming ? 'left' : 'right',
            width: '100%',
            display: 'block'
        };
        return (
            <Paper className="timeline-item">
                <b style={titleStyle}>{event.type}</b>

                <p>{content}</p>
            </Paper>
        );
    }
}

TimeLineItem.propTypes = {
    event: PropTypes.object.isRequired
};
