import React, {Component, PropTypes} from "react";
import {FlatButton, Dialog, Tabs, Tab, Checkbox, TextField, AutoComplete} from "material-ui";
import YAML from "js-yaml";

export default class ExtendedEmitter extends Component {
    static propTypes = {
        open: PropTypes.bool.isRequired,
        handleClose: PropTypes.func.isRequired,
        onEmit: PropTypes.func.isRequired,
        dataSource: PropTypes.array.isRequired,
        searchText: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {
            argumentsType: 'yaml',
            jsonError: null,
            yamlError: null,
            jsonText: '{}',
            yamlText: '',
            callback: false,
            type: props.searchText
        }
    }

    render() {
        const buttons = [
            <FlatButton
                label="Close"
                onTouchTap={this.props.handleClose}
            />,
            <FlatButton
                label="Emit"
                primary={true}
                onTouchTap={() => this.props.onEmit(this.state.type, this.arguments, this.state.callback)}
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
                <AutoComplete
                    ref="type"
                    hintText="Event name"
                    dataSource={this.props.dataSource}
                    searchText={this.state.type}
                    triggerUpdateOnFocus={true}
                    autoComplete="off"
                    fullWidth={true}
                    onUpdateInput={type => this.setState({type})}
                    onNewRequest={type => this.setState({type})}
                />
                <Tabs value={this.state.argumentsType}
                      onChange={argumentsType => typeof(argumentsType) === 'string' && this.setState({argumentsType})}
                      ref="argumentsType">
                    <Tab label="YAML" value="yaml">
                        <TextField
                            hintText="Generated object will be used as first argument for event"
                            multiLine={true}
                            rows={4}
                            fullWidth={true}
                            errorText={this.state.yamlError}
                            onChange={e => this._checkYAMLandUpdate(e.target.value)}
                            value={this.state.yamlText}
                        />
                    </Tab>
                    <Tab label="JSON" value="json">
                        <TextField
                            hintText="Generated object will be used as first argument for event"
                            multiLine={true}
                            rows={4}
                            fullWidth={true}
                            errorText={this.state.jsonError}
                            onChange={e => this._checkJSONandUpdate(e.target.value)}
                            value={this.state.jsonText}
                        />
                    </Tab>
                </Tabs>
                <Checkbox label="Use callback" style={checkboxStyle}
                          checked={this.state.callback}
                          onCheck={e => this.setState({callback: e.target.checked})}/>
            </Dialog>
        );
    }

    _checkJSONandUpdate(jsonText) {
        try {
            JSON.parse(jsonText);
            this.setState({jsonText, jsonError: null});
        } catch (e) {
            this.setState({jsonText, jsonError: e.message});
        }
    }

    _checkYAMLandUpdate(yamlText) {
        try {
            YAML.safeLoad(yamlText);
            this.setState({yamlText, yamlError: null});
        } catch (e) {
            this.setState({yamlText, yamlError: e.message});
        }
    }

    get arguments() {
        if (!this.disabled) {
            switch (this.state.argumentsType) {
                case 'json':
                    if (this.state.jsonError) {
                        return [];
                    }
                    return [JSON.parse(this.state.jsonText)];
                case 'yaml':
                    if (this.state.yamlError) {
                        return [];
                    }
                    return [YAML.safeLoad(this.state.yamlText)];
            }
        }
        return [];
    }

    get disabled() {
        switch (this.state.argumentsType) {
            case 'json':
                return !!this.state.jsonError;
            case 'yaml':
                return !!this.state.yamlError;
        }
        return false;
    }
}

