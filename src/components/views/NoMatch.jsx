import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";

const styles = {};

const NoMatch = (classes) => {
    return (
        <>
            404 Not Found
        </>
    );
};

export default withStyles(styles)(NoMatch);