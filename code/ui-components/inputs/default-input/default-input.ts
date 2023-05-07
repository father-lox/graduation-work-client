import messages from 'code/messages.js';
import HTMLNoteError from 'code/ui-components/note-error/html-note-error.js';

customElements.get(HTMLNoteError.tagName) || customElements.define(HTMLNoteError.tagName, HTMLNoteError);

export default class DefaultInput {
    constructor(private defaultInputElement: HTMLElement) {
        this.hintMessageElement = this.defaultInputElement.querySelector(this.selectors.hintClass) as HTMLParagraphElement;
        this.noteErrorElement = this.defaultInputElement.querySelector(this.selectors.errorClass) as HTMLNoteError;
        this.labelElement = this.defaultInputElement.querySelector(this.selectors.labelClass) as HTMLParagraphElement;
        this.inputElement = this.defaultInputElement.querySelector(this.selectors.inputClass) as HTMLInputElement;

        if (!this.noteErrorElement ||
            !this.hintMessageElement ||
            !this.labelElement ||
            !this.inputElement) {
            throw Error("DefaultInput's markup is incorrect");
        }

        this.inputElement.addEventListener('invalid', () => {
            this.setErrorMessage();
            this.displayInputError(this._errorMessage);
        });

        this.inputElement.addEventListener('input', this.triggerErrorMessage);
    }

    private triggerErrorMessage = () => {
        if (this.isErrorShown && !this.validate()) {
            this.noteErrorElement.shake()
        } else {
            this.displayInputHint();
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
        return this.noteErrorElement.isShown;
    }

    get errorMessage() {
        return this._errorMessage;
    }

    set errorMessage(message: string) {
        this._errorMessage = message;
    }

    displayInputError(errorMessage: string) {
        this.noteErrorElement.show(errorMessage);
        this.hideHint();
    }

    displayInputHint() {
        this.noteErrorElement.hide();
        this.showHint();
    }

    /**
     * Validate from. If error - display error message
     * @param patternMismatchErrorMessage 
     * @returns 
     */
    validate(): boolean {
        if (!this.inputElement.validity.valid) {
            this.setErrorMessage();
            this.displayInputError(this._errorMessage);
        }

        return this.inputElement.validity.valid;
    }

    focus() {
        this.inputElement.focus();
    }

    private showHint() {
        this.hintMessageElement.classList.remove(this.modifierClasses.hintHidden);
    }

    private hideHint() {
        this.hintMessageElement.classList.add(this.modifierClasses.hintHidden);
    }

    private setErrorMessage() {
        if (this.inputElement.validity.valueMissing) {
            this._errorMessage = messages.fieldRequired;
        } else if (this.inputElement.validity.patternMismatch) {
            this._errorMessage = this.inputElement.validationMessage;
        } else if (this.inputElement.validity.tooShort) {
            this._errorMessage = messages.valueTooShort(Number(this.inputElement.minLength));
        } else if (this.inputElement.validity.tooLong) {
            this._errorMessage = messages.valueTooLong(Number(this.inputElement.maxLength));
        } else {
            this._errorMessage = this.inputElement.validationMessage;
        }
    }

    private hintMessageElement: HTMLParagraphElement;
    private noteErrorElement: HTMLNoteError;
    private labelElement: HTMLParagraphElement;
    private inputElement: HTMLInputElement;
    private _errorMessage: string = '';

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