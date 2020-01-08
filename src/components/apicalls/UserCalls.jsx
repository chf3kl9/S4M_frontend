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
}

export default UserCalls;