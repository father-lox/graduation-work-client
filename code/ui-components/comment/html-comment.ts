export default class HTMLComment extends HTMLElement {
    constructor(templateId: string = 'comment') {
        super();
        this.commentFragment = (document.getElementById(templateId) as HTMLTemplateElement).content.cloneNode(true) as unknown as DocumentFragment;
        this.commentContainer = this.commentFragment.querySelector('.comment') as HTMLDivElement;
        this.autographElement = this.commentFragment.querySelector('.comment__autograph') as HTMLParagraphElement;
        this.commentElement = this.commentFragment.querySelector('.comment__text') as HTMLParagraphElement;

        if (!(this.commentFragment || this.autographElement || this.commentElement)) {
            throw new Error("Template is incorrect");
        }
    }

    static get observedAttributes() {
        return ['autograph', 'comment'];
    }

    static availableAttributes = {
        autograph: 'autograph',
        comment: 'comment'
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
            case HTMLComment.availableAttributes.autograph:
                this.updateAutograph(newValue);
                break;
            case HTMLComment.availableAttributes.comment:
                this.updateComment(newValue);
                break;
            default:
                break;
        }
    }

    private commentFragment: DocumentFragment;
    private commentContainer: HTMLDivElement;
    private autographElement: HTMLParagraphElement;
    private commentElement: HTMLParagraphElement;
    private shadowDOMProperty: ShadowRootInit = {
        mode: 'closed'
    }

    private modifierClasses = {
        writerAutograph: 'comment__autograph_writer',
        writerText: 'comment__text_writer'
    }

    private processAttributes() {
        this.setaAutograph();
        this.setComment();
    }

    private setaAutograph() {
        const autograph: string = this.getAttribute(HTMLComment.availableAttributes.autograph) || '';

        if (autograph.length === 0) {
            throw new Error(`"${HTMLComment.availableAttributes.autograph}" attribute is required`);
        }

        this.autographElement.innerText = autograph;
    }

    private updateAutograph(autograph: string) {
        this.autographElement.innerText = autograph;
    }

    private setComment() {
        const comment: string = this.getAttribute(HTMLComment.availableAttributes.comment) || '';

        if (comment.length === 0) {
            throw new Error(`"${HTMLComment.availableAttributes.comment}" attribute is required`);
        }

        this.commentElement.innerText = comment;
    }

    private updateComment(comment: string) {
        this.commentElement.innerText = comment;
    }

    private styleAsAuthorComment() {
        this.autographElement.classList.add(this.modifierClasses.writerAutograph);
        this.commentElement.classList.add(this.modifierClasses.writerText);
    }
}