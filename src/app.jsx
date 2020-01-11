import React, {Component} from 'react';
import firebase from "firebase";
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
import LoginScreen from "./components/views/login/LoginScreen";
import ProfileScreen from "./components/views/user/ProfileScreen";

const styles = () => ({
    root: { display: 'flex' },
});

const firebaseConfig = {
    apiKey: "AIzaSyAQt8KavNcBzQfFu0-AOrG6P2HnyIguZX4",
    authDomain: "s4m-frontend.firebaseapp.com",
    databaseURL: "https://s4m-frontend.firebaseio.com",
    projectId: "s4m-frontend",
    storageBucket: "s4m-frontend.appspot.com",
    messagingSenderId: "990604739638",
    appId: "1:990604739638:web:5310d5a2ed2b1de5eb4497"
};



firebase.initializeApp(firebaseConfig);

class App extends Component {
    state = {
        isSignedIn: false
    };

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            let email = "";
            if (user != null)
                email = user.email;
            this.setState({isSignedIn: !!user, email: email}, () => console.log(user != null));
        });
    }

    render() {
        const {classes} = this.props;
        return (
            <Router>
                <div className={classes.root}>
                    <Dashboard isSignedIn={this.state.isSignedIn} {...this.props}>
                    <Switch>
                        <Route exact path="/" component={() => <Redirect to="/main"/>}/>

                        <Route path="/main" component={MainScreen}/>
                        <Route path="/profile" component={(props) => <ProfileScreen {...props} isSignedIn={this.state.isSignedIn} email={this.state.email}/>}/>

                        <Route path="/movies" component={MovieScreen}/>
                        <Route path="/movie" component={MovieDetailScreen}/>
                        <Route path="/editMovie" component={MovieEditScreen}/>

                        <Route path="/genres" component={GenreScreen}/>
                        <Route path="/genre" component={GenreDetailScreen}/>
                        <Route path="/editGenre" component={GenreEditScreen}/>

                        <Route path="/login" component={LoginScreen}/>
                        {/*<Route path="/logout" component={Logout} /> */}

                        <Route component={NoMatch}/>
                    </Switch>
                </Dashboard>
            </div>
            </Router>
        );
    }
}

export default withRoot(withStyles(styles)(App));