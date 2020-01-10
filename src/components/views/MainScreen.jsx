import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = theme => ({ //todo move to other file and import

});

class MainScreen extends Component {

    state = {

    };

    render() {
        return (
            <div></div>
        );
    }
}

export default withRouter(withStyles(styles)(MainScreen));