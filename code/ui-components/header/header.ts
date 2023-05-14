import URLManager from "code/routes/url-manager.js";
import APIRequestManager from "../../api/api-request-manager.js";

export default class Header {
    constructor(headerId: string = 'header') {
        this.headerElement = document.getElementById(headerId) as HTMLElement;

        this.manageHeaderState();
        this.show();
    }

    show() {
        this.headerElement.classList.remove(this.modifierClasses.hidden);
    }

    private isAuth = new APIRequestManager().isAPITokenSet();
    private urlManager: URLManager = new URLManager();
    private headerElement: HTMLElement;
    private selectorGuestElements: string = '[data-role="guest"]';
    private selectorAuthElements: string = '[data-role="auth"]';
    private modifierClasses: {hidden: string} = {
        hidden: 'header_hidden'
    }

    private manageHeaderState() {
        this.setBotsUrls();

        if (this.isAuth) {
            this.hideGuestElements();
            this.setAuthUrls();
        } else {
            this.hideAuthElements();
            this.setGuestUrls();
        }
    }

    private hideGuestElements() {
        this.headerElement.querySelectorAll(this.selectorGuestElements).forEach(element => element.remove());
    }

    private hideAuthElements() {
        this.headerElement.querySelectorAll(this.selectorAuthElements).forEach(element => element.remove());
    }

    private setBotsUrls() {
        this.setUrl(`#telegram`, this.urlManager.bots.telegram.href);
        this.setUrl(`#vk`, this.urlManager.bots.vk.href);
        this.setUrl(`#discord`, this.urlManager.bots.discord.href);

    }

    private setAuthUrls() {
        this.setUrl(`#main${this.selectorAuthElements}`, this.urlManager.client.main.href);
        this.setUrl(`#editorial-office${this.selectorAuthElements}`, this.urlManager.client.editorialOffice.href);
    }

    private setGuestUrls() {
        this.setUrl(`#candidacy${this.selectorGuestElements}`, this.urlManager.client.candidacy.href);
    }

    private setUrl(elementSelector: string, href: string) {
        const element = this.headerElement.querySelector(elementSelector) as HTMLLinkElement;
        
        if (element) {
            element.href = href;
        } else {
            console.log(`Cold not set url element with selector ${elementSelector}`);
        }
    }
}