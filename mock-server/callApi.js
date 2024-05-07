import { restApi } from "./restApi"

export function callApi(endpoint, input=null) {
    outputFunction = restApi[endpoint];
    output = outputFunction(input);
    output = JSON.parse(output);
    return output;
}