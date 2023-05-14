export default class ClientRoutes {
    private readonly client = new URL('http://127.0.0.1:5500');

    get main() {
        return new URL('/pub/pages/index/', this.client);
    }

    get loginAuthor() {
        return new URL('/pub/pages/auth/login/login.html', this.client);
    }

    get signupAuthor() {
        return new URL('/pub/pages/auth/signup/signup.html', this.client);
    }

    get candidacy() {
        return new URL('/pub/pages/auth/candidacy/candidacy.html ', this.client);
    }

    get editorialOffice() {
        return new URL('/pub/pages/editorial-office/editorial-office.html', this.client);
    }
}