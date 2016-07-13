import React, {Component, PropTypes} from "react"
import ReactDOM from 'react-dom'
import {connect} from "react-redux"
import {List} from "immutable"
import TimeLineItem from "../components/TimeLineItem.js"
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableFooter} from "material-ui"
import Emitter from './Emitter.js'

class TimeLine extends Component {
    render() {
        let {events} = this.props;
        return (
            <Table className="timeline" ref="timeline" selectable={false}>
                <TableHeader displaySelectAll={false}>
                    <TableRow>
                        <TableHeaderColumn colSpan={2}>Type</TableHeaderColumn>
                        <TableHeaderColumn>Data</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {events.map(event => <TimeLineItem key={event.id} event={event}/>)}
                </TableBody>
                <TableFooter>
                    <Emitter />
                </TableFooter>
            </Table>
        );
    }

    componentDidUpdate() {
        let {timeline} = this.refs;
        if (timeline) {
            let bodyDiv = ReactDOM.findDOMNode(timeline.refs.tableDiv);
            bodyDiv.scrollTop = bodyDiv.scrollHeight;
        }
    }
}

TimeLine.propTypes = {
    dispatch: PropTypes.func.isRequired,
    events: PropTypes.instanceOf(List).isRequired
};

function mapStateToProps(state) {
    const timeline = state.timeline;
    let events = timeline.get('events');
    if (!events) events = List.of();
    return {events};
}

export default connect(mapStateToProps)(TimeLine);

