import React, {Component, PropTypes} from 'react';
import {Tabs, Tab, Styles} from 'material-ui';
import {connect} from 'react-redux';

const ThemeManager = Styles.ThemeManager;
const DefaultRawTheme = Styles.LightRawTheme;
const Colors = Styles.Colors;
const ThemeDecorator = Styles.ThemeDecorator;

// theme customization
let muiTheme = ThemeManager.getMuiTheme(DefaultRawTheme);
muiTheme.inkBar.backgroundColor = Colors.yellow200;

@ThemeDecorator(muiTheme)
class App extends Component {
    render() {
        return (
            <div>
                Test
            </div>
        );
    }
}

App.propTypes = {
    dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    return {};;
}

export default connect(mapStateToProps)(App);
