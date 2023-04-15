export default class HTMLField extends HTMLInputElement {
    constructor(templateId: string = 'field') {
        super();
        this.fieldFragment = (document.getElementById(templateId) as HTMLTemplateElement).content.cloneNode(true) as DocumentFragment;
        this.hintMessageElement = this.fieldFragment.querySelector('.default-input__hint') as HTMLParagraphElement;
        this.errorContainerElement = this.fieldFragment.querySelector('.default-input__error') as HTMLDivElement;
        this.errorMessageElement = this.errorContainerElement.querySelector('p') as HTMLParagraphElement;
        this.nameElement = this.fieldFragment.querySelector('.default-input__name') as HTMLParagraphElement;

        if (!this.fieldFragment || !this.hintMessageElement || !this.errorContainerElement || !this.errorMessageElement || !this.nameElement) {
            throw new Error("Template is incorrect");
        }
    }

    connectedCallback() {
        const root: ShadowRoot = this.attachShadow(this.shadowDOMProperty);
        this.processAttributes();
        root.appendChild(this.fieldFragment);
    }

    static attributeNames: {name: string, errorMessage: string, hintMessage: string, isError: string} = {
        name: 'name',
        errorMessage: "error-message",
        hintMessage: "hint-message",
        isError: "error"
    }

    static get observedAttributes() {
        return [
            HTMLField.attributeNames.name, 
            HTMLField.attributeNames.errorMessage,
            HTMLField.attributeNames.hintMessage,
            HTMLField.attributeNames.isError
        ];
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        switch (name) {
            case HTMLField.attributeNames.name:
                this.updateName(newValue);
                break;
            case HTMLField.attributeNames.errorMessage:
                this.updateErrorMessage(newValue);
                break;
            case HTMLField.attributeNames.hintMessage:
                this.updateHintMessage(newValue);
                break;
            case HTMLField.attributeNames.isError:
                this.showErrorMessage(newValue);
                break;
            default:
                break;
        }
    }

    private fieldFragment: DocumentFragment;
    private hintMessageElement: HTMLParagraphElement;
    private errorContainerElement: HTMLDivElement;
    private errorMessageElement: HTMLParagraphElement;
    private nameElement: HTMLParagraphElement;
    private shadowDOMProperty: ShadowRootInit = {
        mode: 'closed'
    }

    private processAttributes() {
        this.setName();
        this.setErrorMessage();
        this.setHintMessage();
    }

    private setName() {
        const name: string = this.getAttribute(HTMLField.attributeNames.name) || '';

        if (name.length === 0) {
            throw new Error(`${HTMLField.attributeNames.name} attribute is required`);

        }

        this.nameElement.innerText = name.toLocaleLowerCase();
    }

    private updateName(name: string) {
        this.nameElement.innerText = name.toLocaleLowerCase();
    }

    private setErrorMessage() {
        const errorMessage: string = this.getAttribute(HTMLField.attributeNames.errorMessage) || '';
        this.errorMessageElement.innerText = errorMessage.toLocaleLowerCase();
    }

    private updateErrorMessage(errorMessage: string) {
        this.errorMessageElement.innerText = errorMessage.toLocaleLowerCase();
    }

    private setHintMessage() {
        const hintMessage: string = this.getAttribute(HTMLField.attributeNames.hintMessage) || '';

        if (hintMessage.length === 0) {
            throw new Error(`${HTMLField.attributeNames.hintMessage} attribute is required`);
        }

        this.hintMessageElement.innerText = hintMessage.toLocaleLowerCase();
    }

    private updateHintMessage(hintMessage: string) {
        this.hintMessageElement.innerText = hintMessage.toLocaleLowerCase();
    }

    private showErrorMessage(isError: string | undefined | null) {
        if (!isError && !this.errorContainerElement.classList.contains('default-input__error_hide')) {
            this.errorContainerElement.classList.add('default-input__error_hide');
            this.hintMessageElement.classList.remove('default-input__hint_hide');
            return;
        }

        this.errorContainerElement.classList.remove('default-input__error_hide');
        this.hintMessageElement.classList.add('default-input__hint_hide');
    }
}
