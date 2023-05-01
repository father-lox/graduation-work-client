export default class URLManager {
    private readonly server = new URL('http://localhost/');
    // private readonly client = new URL()

    get signup() {
        return new URL('/api/signup', this.server);
    }

    get login() {
        return new URL('/api/login', this.server);
    }

    get newApplication() {
        return new URL('/api/new-application', this.server);
    }

    get isValueUnique() {
        return new URL('/api/is-value-unique', this.server);
    }
}