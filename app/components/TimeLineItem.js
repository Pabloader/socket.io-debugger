import React, {Component, PropTypes} from "react";
import {TableRow, TableRowColumn, IconButton, FlatButton, Dialog} from "material-ui";
import ArrowUpward from "material-ui/lib/svg-icons/navigation/arrow-upward";
import ArrowDownward from "material-ui/lib/svg-icons/navigation/arrow-downward";
import Description from "material-ui/lib/svg-icons/action/description";
import yaml from "js-yaml";
import {blue50 as incomingColor, green50 as outgoingColor} from "material-ui/lib/styles/colors";

export default class TimeLineItem extends Component {
    state = {
        open: false,
    };

    handleOpen() {
        this.setState({open: true});
    };

    handleClose() {
        this.setState({open: false});
    };

    render() {
        let {event} = this.props;
        let arrow, direction, color;
        if (event.incoming) {
            arrow = <ArrowDownward/>;
            direction = 'Incoming event';
            color = incomingColor;
        } else {
            arrow = <ArrowUpward/>;
            direction = 'Outgoing event';
            color = outgoingColor;
        }
        const rowStyle = {
            background: color
        };
        const buttons = [
            <FlatButton
                label="OK"
                onTouchTap={() => this.handleClose()}
            />
        ];
        return (
            <TableRow selectable={false} style={rowStyle}>
                <TableRowColumn title={direction} width="5%">{arrow}</TableRowColumn>
                <TableRowColumn>{event.type}</TableRowColumn>
                <TableRowColumn>
                    <pre>{this._renderShort()}</pre>
                </TableRowColumn>
                <TableRowColumn width="5%">
                    <IconButton onClick={() => this.handleOpen()} title="Details">
                        <Description/>
                    </IconButton>
                    <Dialog
                        actions={buttons}
                        modal={true}
                        open={this.state.open}
                        onRequestClose={() => this.handleClose()}
                    >
                        <pre style={{overflow: 'auto'}}>{this._renderDetails()}</pre>
                    </Dialog>
                </TableRowColumn>
            </TableRow>
        );
    }

    get content() {
        let {content} = this.props.event;
        if (Array.isArray(content) && content.length === 1) {
            return content[0];
        } else if (Array.isArray(content) && content.length === 0) {
            return '';
        }
        return content;
    }

    _renderDetails() {
        let {content} = this.props.event;
        if (!content) {
            return '';
        }
        let replacer = (key, value) => {
            if (typeof value === 'function') {
                return value.toString();
            }
            return value;
        };
        let lines = [];
        if (Array.isArray(content)) {
            lines.push('Arguments count: ' + content.length);
            let i = 0;
            for (let arg of content) {
                lines.push(`Argument # ${i++}: `);
                if (typeof arg === 'object') {
                    lines.push(JSON.stringify(arg, replacer, 4));
                } else {
                    lines.push(String(arg));
                }
            }
        } else {
            lines.push(JSON.stringify(content, replacer, 4));
        }
        return lines.join('\n');
    }

    _renderShort() {
        if (!this.content) {
            return '';
        }
        try {
            return yaml.dump(this.content);
        } catch (e) {
            return this.content.toString();
        }
    }
}

TimeLineItem.propTypes = {
    event: PropTypes.object.isRequired
};
