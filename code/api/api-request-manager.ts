import { APIToken } from "types/api.js";

/**
 * Use for send requests to API server;
 */
export default class APIRequestManager {
    constructor() {
        this.headers.append('Accept', 'application/json');
        this.headers.append('Content-Type', 'application/json');
    }

    public sendRequest = async (url: URL, body: any, useAuthToken?: boolean): Promise<Response> => {
        return fetch(url, this.requestOptionBuilder(body, useAuthToken));
    }

    public storeAPIToken = (token: APIToken) => {
        localStorage.setItem(this.localStorageAPITokenKey, token);
    }

    public isAPITokenSet(): boolean {
        return this.getAPIToken() !== null;
    }

    private headers = new Headers();
    private localStorageAPITokenKey: string = 'token';

    private requestOptionBuilder(body: any, useAuthToken?: boolean): RequestInit {
        if (useAuthToken && !this.headers.has('Authorization')) {
            this.headers.append('Authorization', `Bearer ${this.getAPIToken()}`);
        } else if (!useAuthToken && this.headers.has('Authorization')) {
            this.headers.delete('Authorization');
        }

        return {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(body)
        }
    }

    private getAPIToken(): APIToken | null {
        return localStorage.getItem(this.localStorageAPITokenKey);
    }
}