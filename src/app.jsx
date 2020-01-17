import React, {Component} from 'react';
import firebase from "firebase";
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import NoMatch from "./components/views/NoMatch";
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
import ApiCommunication from "./components/apicalls/ApiCommunication";

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
        isSignedIn: false,
        email: null,
        isAdmin: false,
    };

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            let email = "";
            if (user != null) {
                email = user.email;
                ApiCommunication.graphQLRequest("query", "user", "isAdmin", [
                    {name: "email", type: "String", value: email}
                ]).then(response => {
                    this.setState({isAdmin: response.data.data.user.isAdmin});
                });
            } else {
                this.setState({isAdmin:false});
            }
            this.setState({isSignedIn: !!user, email: email}, );
        });
    }

    render() {
        const {classes} = this.props;
        return (
            <Router>
                <div className={classes.root}>
                    <Dashboard isSignedIn={this.state.isSignedIn} {...this.props} isAdmin={this.state.isAdmin}>
                    <Switch>
                        <Route exact path="/" component={() => <Redirect to="/profile"/>}/>

                        <Route path="/profile" component={(props) => <ProfileScreen {...props} isSignedIn={this.state.isSignedIn} email={this.state.email} isAdmin={this.state.isAdmin}/>}/>

                        <Route path="/movies" component={(props) => <MovieScreen {...props} isSignedIn={this.state.isSignedIn} isAdmin={this.state.isAdmin}/>}/>
                        <Route path="/movie" component={(props) => <MovieDetailScreen {...props} isSignedIn={this.state.isSignedIn} email={this.state.email} isAdmin={this.state.isAdmin}/>}/>
                        <Route path="/editMovie" component={(props) => <MovieEditScreen {...props} isSignedIn={this.state.isSignedIn} email={this.state.email} isAdmin={this.state.isAdmin}/>}/>

                        <Route path="/genres" component={(props) => <GenreScreen {...props} isSignedIn={this.state.isSignedIn} isAdmin={this.state.isAdmin}/>}/>
                        <Route path="/genre" component={(props) => <GenreDetailScreen {...props} isSignedIn={this.state.isSignedIn} isAdmin={this.state.isAdmin}/>}/>
                        <Route path="/editGenre" component={(props) => <GenreEditScreen {...props} isSignedIn={this.state.isSignedIn} email={this.state.email} isAdmin={this.state.isAdmin}/>}/>

                        <Route path="/login" component={(props) => <LoginScreen {...props} isSignedIn={this.state.isSignedIn}/>}/>

                        <Route component={NoMatch}/>
                    </Switch>
                </Dashboard>
            </div>
            </Router>
        );
    }
}

export default withRoot(withStyles(styles)(App));