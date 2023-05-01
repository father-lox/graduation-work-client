import { APIToken, CheckableUniqueProperties, ErrorMessage, RegistrationData } from "types/api.js";
import URLManager from "../url-manager.js";
import APIRequestManager from "./api-request-manager.js";

export default class APIManager {
    public signup = async (
        body: RegistrationData,
        onSuccess: () => void,
        onReject: (message: ErrorMessage) => void) => {

        let response: Response = await this.apiRequestManager.sendRequest(this.urlManager.signup, body);

        if (response.status >= 300) {
            onReject(`Error ${response.status}: ${response.statusText}`);
            return;
        }

        let serverResponse = await response.json();

        if (serverResponse.hasOwnProperty('error')) {
            onReject(this.formateServerErrorMessage(serverResponse.error));
            return;
        }

        if (serverResponse.hasOwnProperty('token')) {
            this.storeAPIToken(serverResponse.token);
            onSuccess();
        }
    }

    public async isValueUnique(property: CheckableUniqueProperties, value: string): Promise<boolean> {
        const body = { [property]: value }

        let response: Response = await this.apiRequestManager.sendRequest(this.urlManager.isValueUnique, body);
        let serverMessage: any = await response.json();

        if (serverMessage.hasOwnProperty('isUnique')) {
            return serverMessage.isUnique;
        }

        return false;
    }

    private localStorageAPITokenKey: string = 'token';
    private urlManager = new URLManager();
    private apiRequestManager = new APIRequestManager();

    private storeAPIToken = (token: APIToken) => {
        localStorage.setItem(this.localStorageAPITokenKey, token);
    }

    private getAPIToken(): APIToken | null {
        return localStorage.getItem(this.localStorageAPITokenKey);
    }

    private formateServerErrorMessage(serverErrorMessage: ErrorMessage): ErrorMessage {
        return `Server responses error: ${serverErrorMessage}`;
    }
}