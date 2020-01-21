import axios from "axios";
import GraphQLRG from "./GraphQLQueryGenerator";

class ApiCommunication {
    //static endpoint = "http://localhost:8090/graphql";
    static endpoint = "https://s4m-backend.herokuapp.com/graphql";

    /**
     * @author lfb0801
     * @description a function to make a graphql request that should be superior to all others
     * @param {String} _method Choose between query or mutation
     * @param {String} _function The function from the backend you want to use
     * @param {String} _queryData The data you want to retrieve from the request, or null if not used
     * @param {[{name: String, type: any, value: value}]} _variables Type can only be String or Int, or null if not used
     */
    static graphQLRequest(_method, _function, _queryData, _variables) {
        return axios.post(
            this.endpoint,
            GraphQLRG.generateBody(_method, _function, _queryData, _variables),
            { headers: { "Content-type": "application/json" } }
        )
    }
}

export default ApiCommunication;