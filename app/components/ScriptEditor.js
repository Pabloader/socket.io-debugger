import React, {Component, PropTypes} from "react";
import {FlatButton, Dialog, TextField, SelectField, MenuItem} from "material-ui";
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/textmate';

const EMPTY_SCRIPT_NAME = '<empty>';

export default class ScriptEditor extends Component {
    static propTypes = {
        open: PropTypes.bool.isRequired,
        handleClose: PropTypes.func.isRequired,
        onSave: PropTypes.func,
        onDelete: PropTypes.func,
        onExec: PropTypes.func.isRequired,
        scripts: PropTypes.array
    };

    constructor(props) {
        super(props);
        this.state = {
            callback: false,
            script: '',
            modified: false,
            name: '',
            error: null,
            fn: null,
            scriptObject: null
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
                label="Execute"
                primary={true}
                onTouchTap={() => this.props.onExec(this.state.script)}
                disabled={this.disabled}
            />
        ];
        if (typeof this.props.onSave === 'function') {
            buttons.unshift(<FlatButton
                label="Save script"
                onTouchTap={this.onSave.bind(this)}
                disabled={!this.state.modified}
            />);
        }
        if (typeof this.props.onDelete === 'function' && this.state.scriptObject && this.state.scriptObject.id) {
            buttons.unshift(<FlatButton
                label="Delete script"
                onTouchTap={this.onDelete.bind(this)}
            />);
        }
        return (
            <Dialog
                actions={buttons}
                modal={true}
                open={this.props.open}
                onRequestClose={this.props.handleClose}
                title="Script Editor"
            >
                <SelectField
                    onChange={this.handleChange.bind(this)}
                    fullWidth={true}
                    hintText="Select script"
                    value={this.state.scriptObject}
                >
                    {this._prepareMenuItems()}
                </SelectField>
                <TextField
                    fullWidth={true}
                    value={this.state.name}
                    onChange={e => this.setState({name: e.target.value, modified: true})}
                    onFocus={e => this.state.name === EMPTY_SCRIPT_NAME && this.setState({name: ''})}
                    floatingLabelText="Name"
                />
                <AceEditor
                    mode="javascript"
                    theme="textmate"
                    fontSize={14}
                    onChange={e => this._checkAndUpdate(e)}
                    name="code"
                    width="100%"
                    height="200px"
                    value={this.state.script}
                    editorProps={{$blockScrolling: true}}
                />
            </Dialog>
        );
    }

    _checkAndUpdate(script) {
        try {
            let fn = new Function('on, emit', script);
            this.setState({script, error: null, modified: true, fn});
        } catch (e) {
            this.setState({script, error: e.message, modified: true});
        }
    }

    get disabled() {
        return Boolean(this.error);
    }

    onSave() {
        this.props.onSave(this.state.name, this.state.script, this.state.scriptObject && this.state.scriptObject.id);
        this.setState({modified: false});
    }

    onDelete() {
        this.props.onDelete(this.state.scriptObject);
    }

    _prepareMenuItems() {
        let scripts = this.props.scripts;
        if (!scripts) {
            return [];
        }
        return [
            {name: EMPTY_SCRIPT_NAME, script: ''},
            ...(scripts.filter(script => script.name).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)))
        ].map((script, idx) => (
            <MenuItem
                index={idx} key={idx} value={script}
                label={script.name}
                primaryText={script.name}
            />
        ));
    }

    handleChange(event, idx, scriptObject) {
        let {script, name} = scriptObject;
        this._checkAndUpdate(script);
        this.setState({name, scriptObject, modified: false});
    }

    set scriptObject(scriptObject) {
        console.log(scriptObject);
        this.setState({scriptObject});
    }
}

