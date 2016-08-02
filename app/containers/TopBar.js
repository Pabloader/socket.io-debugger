import React, {Component, PropTypes} from "react";
import {AppBar, IconButton, MenuItem, LeftNav} from "material-ui";
import MenuIcon from "material-ui/lib/svg-icons/navigation/menu";
import {connect} from "react-redux";
import * as actions from "../actions";

class TopBar extends Component {
    state = {
        open: false
    };

    render() {
        let {lastValue} = this.props;

        const icon = (
            <IconButton onClick={e => this.setState({open: true})}>
                <MenuIcon />
            </IconButton>
        );

        return (
            <div>
                <AppBar
                    title={lastValue}
                    iconElementLeft={icon}
                />
                <LeftNav
                    open={this.state.open}
                    docked={false}
                    onRequestChange={open => this.setState({open})}
                >
                    <MenuItem onClick={e => this.newConnection()} index="0">New connection</MenuItem>
                    <MenuItem onClick={e => this.clearTimeline()} index="1">Clear timeline</MenuItem>
                    <MenuItem onClick={e => this.closeMenu()} index="2">Back</MenuItem>
                </LeftNav>
            </div>
        );
    }

    newConnection() {
        this.props.dispatch(actions.newConnection());
        this.clearTimeline();
    }

    clearTimeline() {
        this.props.dispatch(actions.clearTimeline());
        this.closeMenu();
    }

    closeMenu() {
        this.setState({open: false});
    }
}

TopBar.propTypes = {
    dispatch: PropTypes.func.isRequired,
    lastValue: PropTypes.string
};

function mapStateToProps(state) {
    const connector = state.connector;
    let lastValue = connector.get('lastValue');
    return {lastValue};
}

export default connect(mapStateToProps)(TopBar);

