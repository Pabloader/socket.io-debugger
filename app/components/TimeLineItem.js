import React, {Component, PropTypes} from "react";
import {TableRow, TableRowColumn} from "material-ui";
import ArrowUpward from "material-ui/lib/svg-icons/navigation/arrow-upward";
import ArrowDownward from "material-ui/lib/svg-icons/navigation/arrow-downward";
import yaml from "js-yaml";

export default class TimeLineItem extends Component {
    render() {
        let {event} = this.props;
        let content = this._toYAML();
        let arrow, direction;
        if (event.incoming) {
            arrow = <ArrowDownward/>;
            direction = 'Incoming event';
        } else {
            arrow = <ArrowUpward/>;
            direction = 'Outgoing event';
        }
        return (
            <TableRow selectable={false}>
                <TableRowColumn title={direction} width="5%">{arrow}</TableRowColumn>
                <TableRowColumn>{event.type}</TableRowColumn>
                <TableRowColumn>
                    <pre>{content}</pre>
                </TableRowColumn>
            </TableRow>
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

    _toYAML() {
        return yaml.safeDump(this.props.event.content, {
            skipInvalid: true
        });
    }
}

TimeLineItem.propTypes = {
    event: PropTypes.object.isRequired
};
