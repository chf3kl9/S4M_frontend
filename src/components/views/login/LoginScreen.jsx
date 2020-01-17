import React, { Component } from "react";
import firebase from "firebase";
import { StyledFirebaseAuth } from "react-firebaseui";
import ApiCommunication from "../../apicalls/ApiCommunication";
import withStyles from "@material-ui/core/styles/withStyles";
import {withRouter} from "react-router-dom";

const styles = theme => ({

});

class LoginScreen extends Component {

    constructor(props){
        super(props);
        if (this.props.isSignedIn){
            this.props.history.push({
                pathname: "/profile"
            })
        }
    }

    uiConfig = {
        signInFlow: "popup",
        signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        credentialHelper: 'none',
        callbacks: {
            signInSuccessWithAuthResult : () => false
        }
    };

    saveUserInfo(user) {
        const ref = firebase.firestore().collection("users").doc(user.uid)
        ref.get().then(
            doc => {
                if (!doc.exists) {
                    ref.set({uuid: user.uid,username: user.email})
                }
            }
        )
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user != null) {
                ApiCommunication.graphQLRequest("mutation", "createUser", "id", [
                    {name: "email", type: "String", value:user.email}
                ]);
                this.saveUserInfo(user);
            }
        })
    };

    render() {
        return (
            <StyledFirebaseAuth
                uiConfig={this.uiConfig}
                firebaseAuth={firebase.auth()}
            />
        )
    }
}

export default withRouter(withStyles(styles)(LoginScreen));
