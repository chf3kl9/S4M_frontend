import React from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import NoMatch from "./components/views/NoMatch";
import MainScreen from "./components/views/MainScreen";
import MovieScreen from "./components/views/movie/MovieScreen";
import Dashboard from "./components/views/Dashboard";
import withStyles from "@material-ui/core/styles/withStyles";
import withRoot from "./withRoot.jsx";
import MovieDetailScreen from "./components/views/movie/MovieDetailScreen";
import MovieEditScreen from "./components/views/movie/MovieEditScreen";
import GenreEditScreen from "./components/views/genre/GenreEditScreen";
import GenreDetailScreen from "./components/views/genre/GenreDetailScreen";
import GenreScreen from "./components/views/genre/GenreScreen";

const styles = () => ({
    root: { display: 'flex' },
});

const App = ({classes}) => {
    return (
        <Router>
            <DashWrap classes={classes}>
                <Switch>
                    <Route exact path="/" component={() => <Redirect to="/main" />} />

                    <Route path="/main" component={MainScreen} />

                    <Route path="/movies" component={MovieScreen}/>
                    <Route path="/movie" component={MovieDetailScreen}/>
                    <Route path="/editMovie" component={MovieEditScreen}/>

                    <Route path="/genres" component={GenreScreen}/>
                    <Route path="/genre" component={GenreDetailScreen}/>
                    <Route path="/editGenre" component={GenreEditScreen}/>

                    {/*<Route path="/login" component={Login} />
                    <Route path="/logout" component={Logout} /> */}

                    <Route component={NoMatch} />
                </Switch>
            </DashWrap>
        </Router>
    );
};

const DashWrap = ({classes, children}) => {
    return (
        <div className={classes.root}>
            <Dashboard>
                {children}
            </Dashboard>
        </div>
    );
};

export default withRoot(withStyles(styles)(App));