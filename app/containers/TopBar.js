import React, {Component, PropTypes} from "react";
import {AppBar, IconButton} from "material-ui";
import MenuIcon from "material-ui/lib/svg-icons/navigation/menu";
import {connect} from "react-redux";

class TopBar extends Component {
    constructor() {
        super(...arguments);
    }

    render() {
        let {lastValue} = this.props;

        return (
            <AppBar
                title={lastValue}
                iconElementLeft={<IconButton><MenuIcon /></IconButton>}
            />
        );
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

