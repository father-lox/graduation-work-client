/**
 * Use for send requests to API server;
 */
export default class APIRequestManager {
    public sendRequest = async (url: URL, body: any): Promise<Response> => {
        return fetch(url, this.requestOptionBuilder(body));
    }

    private headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    private requestOptionBuilder(body: any): RequestInit {
        return {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(body)
        }
    }
}