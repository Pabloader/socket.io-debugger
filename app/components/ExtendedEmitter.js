import React, {Component, PropTypes} from "react";
import {FlatButton, Dialog, Tabs, Tab, Checkbox, TextField} from "material-ui";
import YAML from "js-yaml";

class ExtendedEmitter extends Component {
    state = {
        value: 'yaml',
        jsonError: null,
        yamlError: null
    };

    render() {
        const buttons = [
            <FlatButton
                label="Close"
                onTouchTap={this.props.handleClose}
            />,
            <FlatButton
                label="Emit"
                primary={true}
                onTouchTap={() => this.props.onEmit(this.type, this.arguments, this.callback)}
                disabled={this.disabled}
            />
        ];
        const checkboxStyle = {
            marginTop: '15px'
        };
        return (
            <Dialog
                actions={buttons}
                modal={true}
                open={this.props.open}
                onRequestClose={this.props.handleClose}
            >
                <TextField
                    hintText="Event name"
                    fullWidth={true}
                    ref="type"
                />
                <Tabs value={this.state.value} onChange={value => typeof(value) === 'string' && this.setState({value})}
                      ref="argumentsType">
                    <Tab label="YAML" value="yaml">
                        <TextField
                            hintText="Generated object will be used as first argument for event"
                            multiLine={true}
                            rows={4}
                            fullWidth={true}
                            ref="yaml"
                            errorText={this.state.yamlError}
                            onChange={() => this._checkYAML()}
                        />
                    </Tab>
                    <Tab label="JSON" value="json">
                        <TextField
                            hintText="Generated object will be used as first argument for event"
                            multiLine={true}
                            rows={4}
                            fullWidth={true}
                            ref="json"
                            errorText={this.state.jsonError}
                            onChange={() => this._checkJSON()}
                            defaultValue="{}"
                        />
                    </Tab>
                    <Tab label="Object" value="object">
                    </Tab>
                </Tabs>
                <Checkbox label="Use callback" style={checkboxStyle} ref="callback"/>
            </Dialog>
        );
    }

    _checkJSON() {
        let json = this.refs.json.getValue();
        try {
            JSON.parse(json);
            this.setState({jsonError: null});
        } catch (e) {
            this.setState({jsonError: e.message});
        }
    }

    _checkYAML() {
        let yaml = this.refs.yaml.getValue();
        try {
            YAML.safeLoad(yaml);
            this.setState({yamlError: null});
        } catch (e) {
            this.setState({yamlError: e.message});
        }
    }

    get arguments() {
        if (!this.disabled) {
            switch (this.state.value) {
                case 'json':
                    if (this.state.jsonError) {
                        return [];
                    }
                    return [JSON.parse(this.refs.json.getValue())];
                case 'yaml':
                    if (this.state.yamlError) {
                        return [];
                    }
                    return [YAML.safeLoad(this.refs.yaml.getValue())];
            }
        }
        return [];
    }

    get callback() {
        return this.refs.callback && this.refs.callback.isChecked();
    }

    get type() {
        return this.refs.type && this.refs.type.getValue();
    }

    get disabled() {
        switch (this.state.value) {
            case 'json':
                return !!this.state.jsonError;
            case 'yaml':
                return !!this.state.yamlError;
        }
        return false;
    }
}

ExtendedEmitter.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    onEmit: PropTypes.func.isRequired
};
export default ExtendedEmitter;

