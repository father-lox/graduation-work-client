import { CheckableUniqueProperties, ErrorMessage, RegistrationData, ApplicationDate, LoginData, PublishedNews, SubmittedComment, UserComment } from "types/api.js";
import { isUserComment } from "types/type-guards.js";
import URLManager from "../routes/url-manager.js";
import APIRequestManager from "./api-request-manager.js";

export default class APIManager {
    public signup = async (
        body: RegistrationData,
        onSuccess: () => void,
        onReject: (message: ErrorMessage) => void) => {

        let response: Response = await this.apiRequestManager.sendRequest(this.urlManager.api.signup, body);

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
        let response: Response = await this.apiRequestManager.sendRequest(this.urlManager.api.newApplication, applicationData);
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
        let response: Response = await this.apiRequestManager.sendRequest(this.urlManager.api.login, loginData);
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

        let response: Response = await this.apiRequestManager.sendRequest(this.urlManager.api.isValueUnique, body);
        let serverMessage: any = await response.json();

        if (serverMessage.hasOwnProperty('isUnique')) {
            return serverMessage.isUnique;
        }

        return false;
    }

    public async postNews(
        news: PublishedNews,
        onSuccess: () => void,
        onReject: (message: ErrorMessage, errorCode: number) => void) {
        const response: Response = await this.apiRequestManager.sendRequest(this.urlManager.api.postNews, news, true);

        if (response.ok) {
            onSuccess();
        } else {
            const serverMessage = await response.json();
            onReject(serverMessage.message, response.status);
        }
    }

    public async sendComment(
        comment: SubmittedComment,
        onSuccess: (comment: UserComment) => void,
        onReject: (message: ErrorMessage, errorCode: number) => void) {
        let response: Response = await this.apiRequestManager.sendRequest(this.urlManager.api.sendComment, comment, this.apiRequestManager.isAPITokenSet());
        const serverMessage = await response.json();

        if (response.ok && isUserComment(serverMessage)) {
            onSuccess(serverMessage);
        } else {
            onReject(serverMessage.message, response.status);
        }
    }

    public async increaseViews(
        newsId: number,
        onSuccess: () => void,
        onReject: (message: ErrorMessage) => void
    ) {
        let response: Response = await this.apiRequestManager.sendRequest(this.urlManager.api.increaseViews, {'news_id': newsId});
        const serverMessage = await response.json();

        if (response.ok && serverMessage.hasBeenIncreased) {
            onSuccess();
        } else {
            onReject(this.formateServerErrorMessage(serverMessage.error || serverMessage.message));
        }
    }

    private urlManager = new URLManager();
    private apiRequestManager = new APIRequestManager();

    private formateServerErrorMessage(serverErrorMessage: ErrorMessage): ErrorMessage {
        return `Server responses error: ${serverErrorMessage}`;
    }
}