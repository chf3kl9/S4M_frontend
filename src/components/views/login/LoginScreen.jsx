import React, { Component } from "react";
import firebase from "firebase";
import { StyledFirebaseAuth } from "react-firebaseui";
import UserCalls from "../../apicalls/UserCalls";

class LoginScreen extends Component {

    userCalls = new UserCalls();

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
                this.userCalls.createUser(user.email);
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

export default LoginScreen;
