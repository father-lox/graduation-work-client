export default class APIRoutes {
    private readonly server = new URL('http://localhost/');

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

    get postNews() {
        return new URL('/api/post-news', this.server);
    }

    get sendComment() {
        return new URL('/api/send-comment', this.server);
    }
}