export default class ClientRoutes {
    readonly clientOrigin = new URL('http://127.0.0.1:5500/');
    readonly login = new URL('pub/pages/auth/login/login.html', this.clientOrigin);
    readonly news = new URL('pub/pages/index/index.html', this.clientOrigin);
}