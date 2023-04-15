import messages from 'code/messages.js';

export default class DefaultInput {
    constructor(private defaultInputElement: HTMLElement) {
        this.hintMessageElement = this.defaultInputElement.querySelector(this.selectors.hintClass) as HTMLParagraphElement;
        this.errorContainerElement = this.defaultInputElement.querySelector(this.selectors.errorClass) as HTMLDivElement;
        this.errorMessageElement = this.errorContainerElement.querySelector('p') as HTMLParagraphElement;
        this.labelElement = this.defaultInputElement.querySelector(this.selectors.labelClass) as HTMLParagraphElement;
        this.inputElement = this.defaultInputElement.querySelector(this.selectors.inputClass) as HTMLInputElement;

        if (!this.errorContainerElement || 
            !this.hintMessageElement || 
            !this.errorMessageElement || 
            !this.labelElement || 
            !this.inputElement) {
                throw Error("DefaultInput's markup is incorrect");
        }

        if (!this.errorContainerElement.classList.contains(this.modifierClasses.errorHidden) &&
        this.hintMessageElement.classList.contains(this.modifierClasses.hintHidden)) {
            this._isErrorShown = true;
        }
    }

    get field(): HTMLElement {
        return this.defaultInputElement;
    }

    get value(): string {
        return this.inputElement.value;
    }

    get name(): string {
        return this.inputElement.name;
    }

    get isErrorShown(): boolean {
        return this._isErrorShown;
    }

    set isErrorShown(value: boolean) {
        this._isErrorShown = value;
    }

    get errorMessage() {
        return this._errorMessage;
    }

    set errorMessage(message: string) {
        this._errorMessage = message;
    }

    showError() {
        this.errorMessageElement.textContent = this._errorMessage.length > 0 ? this._errorMessage : this.inputElement.validationMessage
        this.hintMessageElement.classList.add(this.modifierClasses.hintHidden);
        this.errorContainerElement.classList.remove(this.modifierClasses.errorHidden);
        this.isErrorShown = true;
    }

    showHint() {
        this.hintMessageElement.classList.remove(this.modifierClasses.hintHidden);
        this.errorContainerElement.classList.add(this.modifierClasses.errorHidden);
        this.isErrorShown = false;
    }

    validate(patternMismatchErrorMessage?: string): boolean {
        if (this.inputElement.validity.valid) {
            return this.inputElement.validity.valid;
        }

        if (this.inputElement.validity.valueMissing) {
            this._errorMessage = messages.fieldRequired;
        } else if (this.inputElement.validity.patternMismatch) {
            this._errorMessage = patternMismatchErrorMessage ? patternMismatchErrorMessage : '';
        } else if (this.inputElement.validity.tooShort) {
            this._errorMessage = messages.valueTooShort(Number(this.inputElement.minLength));
        } else if (this.inputElement.validity.tooLong) {
            this._errorMessage = messages.valueTooLong(Number(this.inputElement.maxLength));
        }

        return this.inputElement.validity.valid;
    }

    focus() {
        this.inputElement.focus();
    }

    private hintMessageElement: HTMLParagraphElement;
    private errorContainerElement: HTMLDivElement;
    private errorMessageElement: HTMLParagraphElement;
    private labelElement: HTMLParagraphElement;
    private inputElement: HTMLInputElement;
    private _errorMessage: string = '';
    private _isErrorShown: boolean = false;

    private selectors: DefaultInputSelectors = {
        inputClass: '.default-input__input',
        labelClass: '.default-input__name',
        hintClass: '.default-input__hint',
        errorClass: '.default-input__error',
    }

    private modifierClasses: DefaultInputModifierClasses = {
        rich: 'default-input_rich',
        errorHidden: 'default-input__error_hidden',
        hintHidden: 'default-input__hint_hidden'
    }
}

type DefaultInputSelectors = {
    inputClass: string,
    labelClass: string,
    hintClass: string,
    errorClass: string
}

type DefaultInputModifierClasses = {
    rich: string,
    errorHidden: string,
    hintHidden: string,
}