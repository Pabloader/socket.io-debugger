import React, {Component, PropTypes} from "react";
import Connector from "./Connector.js";
import TimeLine from "./TimeLine.js";
import TopBar from "./TopBar.js";
import {connect} from "react-redux";

class App extends Component {
    render() {
        return (
            <div>
                <TopBar />
                <Connector />
                <TimeLine />
            </div>
        );
    }
}

App.propTypes = {
    dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps)(App);
