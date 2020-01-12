export default class GraphQLRG {
    static generateBody(_method, _function, _queryData, _variables) {
        let response = `{"query":"${_method}`;
        if (_variables != null) {
            response += "(";
            _variables.map(variable => {
                return (response += `${"$"}${variable.name}:${variable.type}!,`);
            });
            response = response.substring(0, response.length - 1) + ")";
        }
        response += `{${_function}`;
        if (_variables != null) {
            response += "(";
            _variables.map(variable => {
                return (response += `${variable.name}: ${"$"}${variable.name},`);
            });
            response = response.substring(0, response.length - 1);
            response += ")";
        }
        if (_queryData != null) response += `{${_queryData}}`;
        response += `}","variables": {`;
        if (_variables != null) {
            _variables.map(variable => {
                response += ` "${variable.name}":`;
                if (variable.type === "Int") {
                    response += `${variable.value},`;
                } else {
                    if (variable.value == null) {
                        response += ` "" `;
                    } else response += `"${variable.value}",`;
                }
                return response;
            });
            response = response.substring(0, response.length - 1);
        }
        response += "}}";
        return response;
    }
}