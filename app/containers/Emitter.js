import React, {Component, PropTypes} from "react";
import {AutoComplete, TableRow, TableRowColumn, IconButton, TextField, Dialog, FlatButton, Snackbar} from "material-ui";
import ArrowUpward from "material-ui/lib/svg-icons/navigation/arrow-upward";
import Code from "material-ui/lib/svg-icons/action/code";
import Description from "material-ui/lib/svg-icons/action/description";
import {connect} from "react-redux";
import {List, Set} from "immutable";
import ExtendedEmitter from "../components/ExtendedEmitter";
import ScriptEditor from "../components/ScriptEditor";
import * as actions from "../actions";

class Emitter extends Component {
    state = {
        open: false,
        openScriptEditor: false,
        templateNameOpen: false,
        templateDeleteOpen: false,
        scriptDeleteOpen: false,
        template: {},
        script: {},
        templateName: '',
        snackbarOpen: false
    };

    openExtendedEmitter() {
        this.setState({open: true});
    }

    closeExtendedEmitter() {
        this.setState({open: false});
    }

    openScriptEditor() {
        this.setState({openScriptEditor: true});
    }

    closeScriptEditor() {
        this.setState({openScriptEditor: false});
    }

    render() {
        let {lastValue, templates, scripts} = this.props;
        var dataSource = this._prepareDataSource();
        return (
            <TableRow selectable={false}>
                <TableRowColumn title="Send" width="5%">
                    <IconButton onClick={e => this.doEmit()}>
                        <ArrowUpward/>
                    </IconButton>
                </TableRowColumn>
                <TableRowColumn>
                    <AutoComplete
                        ref="type"
                        hintText="Event name"
                        dataSource={dataSource}
                        searchText={lastValue && lastValue.eventType}
                        triggerUpdateOnFocus={true}
                        autoComplete="off"
                        fullWidth={true}
                        onKeyUp={e => e.keyCode === 13 && this.doEmit()}
                    />
                </TableRowColumn>
                <TableRowColumn>
                    <TextField
                        hintText="String will be used as first argument for event"
                        fullWidth={true}
                        ref="text"
                        onKeyUp={e => e.keyCode === 13 && this.doEmit()}
                    />
                </TableRowColumn>
                <TableRowColumn width="150">
                    <IconButton title="SocketScript" onClick={() => this.openScriptEditor()}>
                        <Description/>
                    </IconButton>
                    <IconButton title="Extended" onClick={() => this.openExtendedEmitter()}>
                        <Code/>
                    </IconButton>
                    <ExtendedEmitter
                        handleClose={() => this.closeExtendedEmitter()}
                        open={this.state.open}
                        onEmit={this.onExtendedEmit.bind(this)}
                        onSave={this.onRequestSave.bind(this)}
                        onDelete={this.onRequestDelete.bind(this)}
                        dataSource={dataSource}
                        searchText={lastValue && lastValue.eventType}
                        templates={templates && templates.toJS()}
                    />
                    <ScriptEditor
                        handleClose={() => this.closeScriptEditor()}
                        open={this.state.openScriptEditor}
                        onExec={this.onExec.bind(this)}
                        onSave={this.onScriptSave.bind(this)}
                        onDelete={this.onRequestScriptDelete.bind(this)}
                        scripts={scripts && scripts.toJS().filter(s => s.server === this.props.server)}
                        ref="scriptEditor"
                    />
                    <Dialog
                        actions={[
                            <FlatButton
                                label="Cancel"
                                onTouchTap={e => this.setState({templateNameOpen: false})}
                            />,
                            <FlatButton
                                label="Ok"
                                primary={true}
                                onTouchTap={() => this.onTemplateSave()}
                            />
                        ]}
                        modal={false}
                        open={this.state.templateNameOpen}
                        onRequestClose={e => this.setState({templateNameOpen: false})}
                        title="Input template name"
                    >
                        <TextField
                            value={this.state.templateName}
                            fullWidth={true}
                            onChange={event => this.setState({templateName: event.target.value})}
                        />
                    </Dialog>
                    <Dialog
                        actions={[
                            <FlatButton
                                label="Cancel"
                                onTouchTap={e => this.setState({templateDeleteOpen: false})}
                            />,
                            <FlatButton
                                label="Delete"
                                primary={true}
                                onTouchTap={() => this.onTemplateDelete()}
                            />
                        ]}
                        modal={false}
                        open={this.state.templateDeleteOpen}
                        onRequestClose={e => this.setState({templateDeleteOpen: false})}
                        title={`Really delete template ${this.state.template.name}?`}
                    />
                    <Dialog
                        actions={[
                            <FlatButton
                                label="Cancel"
                                onTouchTap={e => this.setState({scriptDeleteOpen: false})}
                            />,
                            <FlatButton
                                label="Delete"
                                primary={true}
                                onTouchTap={() => this.onScriptDelete()}
                            />
                        ]}
                        modal={false}
                        open={this.state.scriptDeleteOpen}
                        onRequestClose={e => this.setState({scriptDeleteOpen: false})}
                        title={`Really delete script ${this.state.script.name}?`}
                    />
                    <Snackbar
                        open={this.state.snackbarOpen}
                        message="Saved"
                        autoHideDuration={2000}
                        onRequestClose={e => this.setState({snackbarOpen: false})}
                    />
                </TableRowColumn>
            </TableRow>
        );
    }

    doEmit() {
        this.onEmit(this.refs.type.getValue(), this.refs.text.getValue());
    }

    _prepareDataSource() {
        let {history} = this.props;
        return history.toJS().filter(Boolean);
    }

    onEmit(type, text) {
        let {dispatch} = this.props;
        dispatch(actions.emit(type, text));
    }

    onExec(script) {
        let {dispatch} = this.props;
        dispatch(actions.executeScript(script));
    }

    onExtendedEmit(type, args, cb) {
        let {dispatch} = this.props;
        this.closeExtendedEmitter();
        if (cb) {
            var callback = function (...callbackArgs) {
                dispatch(actions.addEvent('callback:' + type, callbackArgs, true));
            };
            callback.toString = () => 'function() { /* code hidden */ }';
            args.push(callback);
        }
        dispatch(actions.emit(type, ...args));
    }

    onRequestSave(eventType, args, callbackUsed) {
        this.setState({template: {eventType, args, callbackUsed}, templateNameOpen: true, templateName: eventType});
    }

    onRequestDelete(template) {
        this.setState({template, templateDeleteOpen: true});
    }

    onRequestScriptDelete(script) {
        this.setState({script, scriptDeleteOpen: true});
    }

    onTemplateSave() {
        let template = this.state.template;
        this.props.dispatch(actions.addTemplate(template.eventType, template.args, template.callbackUsed, this.state.templateName));
        this.setState({templateNameOpen: false, snackbarOpen: true});
    }

    onScriptSave(name, script, id) {
        this.props.dispatch(actions.addScript(name, script, id, this.props.server));
        this.setState({snackbarOpen: true});
        setTimeout(() => this.refs.scriptEditor.scriptObject = this.props.scripts.last());
    }

    onTemplateDelete() {
        this.props.dispatch(actions.removeTemplate(this.state.template.id));
        this.setState({templateDeleteOpen: false});
    }

    onScriptDelete() {
        this.props.dispatch(actions.removeScript(this.state.script.id));
        this.setState({scriptDeleteOpen: false});
    }
}

Emitter.propTypes = {
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.instanceOf(Set),
    templates: PropTypes.instanceOf(List),
    scripts: PropTypes.instanceOf(List),
    lastValue: PropTypes.string
};

function mapStateToProps(state) {
    const emitter = state.emitter;
    const connector = state.connector;
    let history = emitter.get('history');
    let templates = emitter.get('templates');
    let scripts = emitter.get('scripts');
    let lastValue = emitter.get('lastValue');
    let server = connector.get('lastValue');
    if (!history) history = Set.of();
    return {history, lastValue, open, templates, scripts, server};
}

export default connect(mapStateToProps)(Emitter);

