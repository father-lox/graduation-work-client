import { APIToken, CheckableUniqueProperties, ErrorMessage, RegistrationData, ApplicationDate, LoginData, NewsData } from "types/api.js";
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
            this.apiRequestManager.storeAPIToken(serverResponse.token);
            onSuccess();
        }
    }

    public async sendApplication(
        applicationData: ApplicationDate,
        onSuccess: () => void,
        onReject: (message: ErrorMessage) => void
        ) {
            let response: Response = await this.apiRequestManager.sendRequest(this.urlManager.newApplication, applicationData);
            let serverResponse = await response.json();

            if (response.ok) {
                onSuccess();
            } else if (serverResponse.hasOwnProperty('error')) {
                onReject(this.formateServerErrorMessage(serverResponse.message));
            }
    }

    public async login(
        loginData: LoginData,
        onSuccess: () => void,
        onReject: (message: ErrorMessage) => void
        ) {
            let response: Response = await this.apiRequestManager.sendRequest(this.urlManager.login, loginData);
            let serverResponse = await response.json();

            if (response.status === 201 && 'user' in serverResponse && 'token' in serverResponse) {
                this.apiRequestManager.storeAPIToken(serverResponse.token);
                onSuccess();
            } else if ('errors' in serverResponse || 'message' in serverResponse) {
                onReject(this.formateServerErrorMessage(serverResponse.message));
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

    public async postNews(
        news: NewsData,
        onSuccess: () => void,
        onReject: (message: ErrorMessage, errorCode: number) => void) {
            const response: Response = await this.apiRequestManager.sendRequest(this.urlManager.postNews, news, true);

            if (response.ok) {
                onSuccess();
            } else {
                const serverMessage = await response.json();
                onReject(serverMessage.message, response.status);
            }
        }

    private urlManager = new URLManager();
    private apiRequestManager = new APIRequestManager();

    private formateServerErrorMessage(serverErrorMessage: ErrorMessage): ErrorMessage {
        return `Server responses error: ${serverErrorMessage}`;
    }
}