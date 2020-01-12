import axios from "axios";

class UserCalls {

    endpoint = "http://localhost:8090";
    //endpoint = "https://s4m-backend.herokuapp.com";

    createUser(email) {
        let call = "/users";
        axios
            .post(this.endpoint + call, {email: email, isAdmin: false})
            .catch(error => {console.log(error); console.log(error.response)});
    }

    getUser(screen, email) {
        let call = "/users/email/" + email;
        axios
            .get(this.endpoint + call)
            .then(response =>
                screen.setState({user: response.data})
            )
            .catch(error => {console.log(error); console.log(error.response)});
    }

    createComment(comment){
        let call = "/comments";
        axios
            .post(this.endpoint + call, {comment: comment})
            .catch(error => {console.log(error); console.log(error.response)});
    }
}

export default UserCalls;