import React, {Component, PropTypes} from 'react';
import {Paper} from 'material-ui';

export default class TimeLineItem extends Component {
    render() {
        let {event} = this.props;
        let content = this._renderContent();
        let titleStyle = {
            textAlign: event.incoming ? 'left' : 'right',
            width: '100%',
            display: 'block'
        };
        let className = 'timeline-item';
        if(event.incoming) {
            className += ' timeline-item-incoming';
        }
        return (
            <Paper className={className} zDepth={2}>
                <b style={titleStyle}>{event.type}</b>

                <pre>{content}</pre>
            </Paper>
        );
    }

    _renderContent() {
        let {content} = this.props.event;
        if (!content) {
            return '';
        }
        return JSON.stringify(content, (key, value) => {
            if (typeof value === 'function') {
                return 'function';
            }
            return value;
        }, 4);
    }
}

TimeLineItem.propTypes = {
    event: PropTypes.object.isRequired
};
