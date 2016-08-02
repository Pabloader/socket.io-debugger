import React, {Component, PropTypes} from "react";
import {FlatButton, Dialog, Tabs, Tab, Checkbox, TextField, AutoComplete, SelectField, MenuItem} from "material-ui";
import YAML from "js-yaml";

export default class ExtendedEmitter extends Component {
    static propTypes = {
        open: PropTypes.bool.isRequired,
        handleClose: PropTypes.func.isRequired,
        onSave: PropTypes.func,
        onEmit: PropTypes.func.isRequired,
        dataSource: PropTypes.array.isRequired,
        searchText: PropTypes.string,
        templates: PropTypes.array
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
        if (typeof this.props.onSave === 'function') {
            buttons.unshift(<FlatButton
                label="Save as template"
                onTouchTap={this.onSave.bind(this)}
            />);
        }
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
                <SelectField
                    onChange={this.handleChange.bind(this)}
                    fullWidth={true}
                    hintText="Select template"
                >
                    {this._prepareMenuItems()}
                </SelectField>
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
                            floatingLabelText="Generated object will be used as first argument for event"
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
                            floatingLabelText="Generated object will be used as first argument for event"
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
            let object = JSON.parse(jsonText);
            this.setState({jsonText, jsonError: null, yamlText: YAML.dump(object), yamlError: null});
        } catch (e) {
            this.setState({jsonText, jsonError: e.message});
        }
    }

    _checkYAMLandUpdate(yamlText) {
        try {
            let object = YAML.safeLoad(yamlText);
            this.setState({yamlText, yamlError: null, jsonText: JSON.stringify(object, null, 4), jsonError: null});
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

    onSave() {
        this.props.onSave(this.state.type, this.arguments, this.state.callback);
    }

    _prepareMenuItems() {
        let templates = this.props.templates;
        if (!templates) {
            return [];
        }
        return templates.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)).map((template, idx) => (
            <MenuItem
                index={idx} key={idx} value={template}
                label={template.name}
                primaryText={template.name}/>
        ));
    }

    handleChange(event, idx, value) {
        let {eventType, args, callbackUsed}  = value;
        let arg = args[0];
        this._checkJSONandUpdate(JSON.stringify(arg));
        this.setState({type: eventType, callback: callbackUsed});
    }
}

