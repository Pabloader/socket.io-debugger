import React, {Component, PropTypes} from "react";
import {FlatButton, Dialog, Tabs, Tab, Checkbox, AutoComplete, SelectField, MenuItem} from "material-ui";
import YAML from "js-yaml";
import AceEditor from "react-ace";
import "brace/mode/json";
import "brace/mode/yaml";
import "brace/theme/textmate";

export default class ExtendedEmitter extends Component {
    static propTypes = {
        open: PropTypes.bool.isRequired,
        handleClose: PropTypes.func.isRequired,
        onSave: PropTypes.func,
        onDelete: PropTypes.func,
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
            type: props.searchText,
            template: null
        }
    }

    render() {
        const buttons = [
            <FlatButton
                label="Close"
                secondary={true}
                onTouchTap={this.props.handleClose}
            />,
            <FlatButton
                label="Emit"
                primary={true}
                onTouchTap={() => this.props.onEmit(this.state.type, this.arguments, this.state.callback)}
                disabled={this.disabled}
            />
        ];
        if (typeof this.props.onSave === 'function' && !this.state.template) {
            buttons.unshift(<FlatButton
                label="Save as template"
                onTouchTap={this.onSave.bind(this)}
            />);
        } else if (typeof this.props.onDelete === 'function' && this.state.template && this.state.template.id) {
            buttons.unshift(<FlatButton
                label="Delete template"
                onTouchTap={this.onDelete.bind(this)}
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
                title="Extended Emitter"
            >
                <SelectField
                    onChange={this.handleChange.bind(this)}
                    fullWidth={true}
                    hintText="Select template"
                    value={this.state.template}
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
                    onUpdateInput={type => this.setState({type, template: null})}
                    onNewRequest={type => this.setState({type})}
                />
                <Tabs value={this.state.argumentsType}
                      onChange={argumentsType => typeof(argumentsType) === 'string' && this.setState({argumentsType})}
                      ref="argumentsType">
                    <Tab label="YAML" value="yaml">
                        <AceEditor
                            mode="yaml"
                            theme="textmate"
                            fontSize={14}
                            onChange={e => this._checkYAMLandUpdate(e)}
                            name="yaml_code"
                            width="100%"
                            height="200px"
                            value={this.state.yamlText}
                            editorProps={{$blockScrolling: true}}
                        />
                    </Tab>
                    <Tab label="JSON" value="json">
                        <AceEditor
                            mode="json"
                            theme="textmate"
                            fontSize={14}
                            onChange={e => this._checkJSONandUpdate(e)}
                            name="json_code"
                            width="100%"
                            height="200px"
                            value={this.state.jsonText}
                            editorProps={{$blockScrolling: true}}
                        />
                    </Tab>
                </Tabs>
                <Checkbox label="Use callback" style={checkboxStyle}
                          checked={this.state.callback}
                          onCheck={e => this.setState({callback: e.target.checked, template: null})}/>
            </Dialog>
        );
    }

    _checkJSONandUpdate(jsonText) {
        try {
            let object = JSON.parse(jsonText);
            this.setState({jsonText, jsonError: null, yamlText: YAML.dump(object), yamlError: null, template: null});
        } catch (e) {
            this.setState({jsonText, jsonError: e.message, template: null});
        }
    }

    _checkYAMLandUpdate(yamlText) {
        try {
            let object = YAML.safeLoad(yamlText);
            this.setState({
                yamlText,
                yamlError: null,
                jsonText: JSON.stringify(object, null, 4),
                jsonError: null,
                template: null
            });
        } catch (e) {
            this.setState({yamlText, yamlError: e.message, template: null});
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

    onDelete() {
        this.props.onDelete(this.state.template);
        this.setState({template: null});
    }

    _prepareMenuItems() {
        let templates = this.props.templates;
        if (!templates) {
            return [];
        }
        return templates.filter(template => template.name).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)).map((template, idx) => (
            <MenuItem
                index={idx} key={idx} value={template}
                label={template.name}
                primaryText={template.name}
                secondaryText={template.eventName}
            />
        ));
    }

    handleChange(event, idx, template) {
        let {eventType, args, callbackUsed} = template;
        let arg = args[0];
        this._checkJSONandUpdate(JSON.stringify(arg));
        this.setState({type: eventType, callback: callbackUsed, template});
    }
}

