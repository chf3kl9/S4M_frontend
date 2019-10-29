import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = theme => ({ //todo move to other file and import

});

class MovieScreen extends Component {

    constructor(props){
        super(props);
        //todo
    }

    state = {

    };

    render() {
        return (
            <div></div>
        );
    }
}

export default withRouter(withStyles(styles)(MovieScreen));