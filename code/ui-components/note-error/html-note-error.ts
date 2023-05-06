export default class HTMLNoteError extends HTMLElement {
    constructor(templateId: string = 'note-error') {
        super();
        this.noteErrorFragment = (document.getElementById(templateId) as HTMLTemplateElement).content.cloneNode(true) as unknown as DocumentFragment;
        this.noteErrorContainerElement = this.noteErrorFragment.querySelector('.note-error') as HTMLDivElement;
        this.errorTextElement = this.noteErrorFragment.querySelector('.note-error__text') as HTMLParagraphElement;

        if (!(this.noteErrorFragment || this.errorTextElement)) {
            throw new Error("Template is incorrect");
        }

        this.updateVisible();

        this.noteErrorContainerElement.addEventListener('animationend', this.restartAnimation);
    }

    static availableAttributes: {errorMessage: string, hidden: string} = {
        errorMessage: 'error-message',
        hidden: 'hidden'
    }

    static get observedAttributes() {
        return [HTMLNoteError.availableAttributes.errorMessage, HTMLNoteError.availableAttributes.hidden];
    }

    static get tagName() {
        return 'note-error';
    }

    resetMessage() {
        this.setMessage('');
    }

    hide() {
        this.setAttribute(HTMLNoteError.availableAttributes.hidden, '');
    }

    show(message?: string) {
        if (message) {
            this.setMessage(message);
        }
        
        this.removeAttribute(HTMLNoteError.availableAttributes.hidden);
    }

    setMessage(message: string) {
        this.setAttribute(HTMLNoteError.availableAttributes.errorMessage, message);
    }

    get isShown(): boolean {
        return !this.hasAttribute(HTMLNoteError.availableAttributes.hidden);
    }

    connectedCallback() {
        const root: ShadowRoot = this.attachShadow(this.shadowDOMProperty);
        root.appendChild(this.noteErrorFragment);
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        switch (name) {
            case HTMLNoteError.availableAttributes.errorMessage:
                this.updateErrorMessage(newValue);
                break;
            case HTMLNoteError.availableAttributes.hidden:
                this.updateVisible();
            default:
                break;
        }
    }

    shake = () => {
        // this.noteErrorContainerElement.getAnimations().forEach(animation => {
        //     animation.play();
        // });
        this.noteErrorContainerElement.classList.add(this.modifierClasses.animated);
    }

    private restartAnimation = () => {
        this.noteErrorContainerElement.classList.remove(this.modifierClasses.animated);
    }

    private noteErrorFragment: DocumentFragment;
    private noteErrorContainerElement: HTMLDivElement; 
    private errorTextElement: HTMLParagraphElement;
    private modifierClasses: {hidden: string, animated: string} = {
        hidden: 'note-error_hidden',
        animated: 'note-error_shake'
    }
    private shadowDOMProperty: ShadowRootInit = {
        mode: 'closed'
    }

    private updateErrorMessage(errorMessage: string) {
        this.errorTextElement.innerText = errorMessage;
    }

    private updateVisible() {
        if (this.hasAttribute(HTMLNoteError.availableAttributes.hidden)) {
            this.noteErrorContainerElement.classList.add(this.modifierClasses.hidden);
        } else {
            this.noteErrorContainerElement.classList.remove(this.modifierClasses.hidden);
        }
    }
}