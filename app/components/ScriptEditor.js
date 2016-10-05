import React, {Component, PropTypes} from "react";
import {FlatButton, Dialog, TextField, SelectField, MenuItem} from "material-ui";

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
            script: null,
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
        if (typeof this.props.onDelete === 'function') {
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
                    floatingLabelText="Name"
                />
                <TextField
                    floatingLabelText="Script"
                    multiLine={true}
                    rows={8}
                    fullWidth={true}
                    errorText={this.state.error}
                    onChange={e => this._checkAndUpdate(e.target.value)}
                    value={this.state.script}
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
        this.props.onSave(this.state.name, this.state.script);
        this.setState({modified: false});
    }

    onDelete() {
        this.props.onDelete(this.state.name);
        this.setState({modified: false});
    }

    _prepareMenuItems() {
        let scripts = this.props.scripts;
        if (!scripts) {
            return [];
        }
        return scripts.filter(template => template.name).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)).map((script, idx) => (
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
}

