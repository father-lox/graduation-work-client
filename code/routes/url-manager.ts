import APIRoutes from "./api-routes.js";
import ClientRoutes from "./client-routes.js";
import BotRoutes from './bot-routes.js';

export default class URLManager {
    readonly api = new APIRoutes();
    readonly client = new ClientRoutes();
    readonly bots = new BotRoutes();
}