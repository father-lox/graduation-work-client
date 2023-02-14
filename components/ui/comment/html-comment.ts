export default class HTMLComment extends HTMLElement {

    constructor(templateId: string = 'comment') {
        super();
        this.template = document.getElementById(templateId) as HTMLTemplateElement;
        this.commentNode = this.template.content.cloneNode(true) as unknown as HTMLDivElement;
        this.nicknameElement = this.commentNode.querySelector('.comment__nickname') as HTMLParagraphElement;
        this.commentElement = this.commentNode.querySelector('.comment__text') as HTMLParagraphElement;
    
        if (!(this.template || this.commentNode || this.nicknameElement || this.commentElement)) {
            throw new Error("Template is incorrect");
               
        }
    }

    static get observedAttributes() {
        return ['nickname', 'comment'];
    }

    connectedCallback() {
        const root: ShadowRoot = this.attachShadow(this.shadowDOMProperty);
        root.appendChild(this.commentNode);
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

    private template: HTMLTemplateElement;
    private commentNode: HTMLDivElement;
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