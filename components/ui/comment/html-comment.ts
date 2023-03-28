export default class HTMLComment extends HTMLElement {

    constructor(templateId: string = 'comment') {
        super();
        this.commentFragment = (document.getElementById(templateId) as HTMLTemplateElement).content.cloneNode(true) as unknown as DocumentFragment;
        this.commentContainer = this.commentFragment.querySelector('.comment') as HTMLDivElement;
        this.nicknameElement = this.commentFragment.querySelector('.comment__nickname') as HTMLParagraphElement;
        this.commentElement = this.commentFragment.querySelector('.comment__text') as HTMLParagraphElement;

        if (!(this.commentFragment || this.nicknameElement || this.commentElement)) {
            throw new Error("Template is incorrect");

        }
    }

    static get observedAttributes() {
        return ['nickname', 'comment'];
    }

    hide() {
        this.commentContainer.classList.add('comment_hidden');
        this.commentContainer.classList.remove('comment_shown');
    }

    show() {
        this.commentContainer.classList.add('comment_shown');
        this.commentContainer.classList.remove('comment_hidden');
    }

    connectedCallback() {
        const root: ShadowRoot = this.attachShadow(this.shadowDOMProperty);
        root.appendChild(this.commentFragment);
        this.processAttributes();

        if (this.hasAttribute('is-author')) {
            this.styleAsAuthorComment();
        }
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        switch (name) {
            case 'nickname':
                this.updateNickname(newValue);
                break;
            case 'comment':
                this.updateComment(newValue);
                break;
            default:
                break;
        }
    }

    private commentFragment: DocumentFragment;
    private commentContainer: HTMLDivElement;
    private nicknameElement: HTMLParagraphElement;
    private commentElement: HTMLParagraphElement;
    private shadowDOMProperty: ShadowRootInit = {
        mode: 'closed'
    }

    private processAttributes() {
        this.setNickname();
        this.setComment();
    }

    private setNickname() {
        const nickname: string = this.getAttribute('nickname') || '';

        if (nickname.length === 0) {
            throw new Error('"nickname" attribute is required');

        }

        this.nicknameElement.innerText = 'Comment by @' + nickname;
    }

    private updateNickname(nickname: string) {
        this.nicknameElement.innerText = 'Comment by @' + nickname;
    }

    private setComment() {
        const comment: string = this.getAttribute('comment') || '';

        if (comment.length === 0) {
            throw new Error('"comment" attribute is required');

        }

        this.commentElement.innerText = comment;
    }

    private updateComment(comment: string) {
        this.commentElement.innerText = comment;
    }

    private styleAsAuthorComment() {
        this.nicknameElement.classList.add('comment__nickname_writer');
        this.commentElement.classList.add('comment__text_writer');
    }
}