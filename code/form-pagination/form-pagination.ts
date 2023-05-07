import { FormFragment, FormPaginationOptions, ProgressElement, RegressElement, submitCallback, validateAdditionalCallback } from 'types/form-pagination';

export default class FormPagination {
    constructor(options: FormPaginationOptions) {
        if (typeof options.fragments === 'string') {
            const elements = document.querySelectorAll(options.fragments);

            if (!elements.length) {
                throw Error('The selector of items is not correct');
            }

            this._items = Array.from(elements) as FormFragment[];
        } else {
            this._items = options.fragments;
        }

        this._validateAdditional = options.validateAdditional;
        this.submitButtonText = options.submitButtonText;
        this.countVisible = options.visible;

        this.setProgressElement(options.progressElement);
        this.setRegressElement(options.regressElement);
        this.calculateCountShowingItems();
        this.init();
    }

    async next() {
        const isValid = await this.validate();

        if (!isValid) {
            return;
        }

        if (!this.canSwitchNext) {
            this.progressElement.type = 'submit';
            return;
        }

        this.hideCurrent();

        this._indexCurrentItem += this.countVisible;
        this.calculateCountShowingItems();

        for (let i = 0; i < this._countShowingItems; i++) {
            this.showFragment(this._items[this._indexCurrentItem + i]);
        }

        this.manageStateFormControllers();
    }

    back() {
        if (!this.canSwitchPrevious) {
            return;
        }

        this.hideCurrent();

        this._indexCurrentItem -= this.countVisible;
        this.calculateCountShowingItems();

        for (let i = 0; i < this._countShowingItems; i++) {
            this.showFragment(this._items[this._indexCurrentItem + i]);
        }

        this.manageStateFormControllers();
    }

    private async validate(): Promise<boolean> {
        let areInputsValid: boolean = true;
        let isFocusSet = false;

        for await (const fragment of this.currentFields) {
            const input: HTMLInputElement | null = fragment.querySelector('input');

            if (input === null) {
                throw Error('Field is not fillable');
            }

            let isValid = input.checkValidity();

            if (isValid && this._validateAdditional) {
                isValid = await this._validateAdditional(fragment)
            }

            if (!isFocusSet && !isValid) {
                //Set the focus to the first incorrect input, if it is not already set
                input.focus();
                isFocusSet = true;
            }

            areInputsValid &&= isValid;
        };

        return areInputsValid;
    }

    get canSwitchNext(): boolean {
        return this._indexCurrentItem < this._items.length - this.countVisible;
    }

    get canSwitchPrevious(): boolean {
        return this._indexCurrentItem !== 0;
    }

    get indexCurrentItem(): number {
        return this._indexCurrentItem;
    }

    get currentFields(): FormFragment[] {
        return this._items.slice(this._indexCurrentItem, this._indexCurrentItem + this._countShowingItems);
    }

    private progressElement!: ProgressElement;
    private regressElement!: RegressElement;
    private submitButtonText: string;
    private countVisible: number;
    private _items: FormFragment[];
    private _indexCurrentItem = 0;
    private _countShowingItems = 0;
    private _validateAdditional: validateAdditionalCallback | undefined;

    private init() {
        for (let i = this.countVisible; i < this._items.length; i++) {
            this.hideFragment(this._items[i]);
        }

        this.manageStateFormControllers();
    }

    private manageStateFormControllers() {
        this.manageStateProgressElement();
        this.manageStateRegressElement();
    }
    
    private manageStateProgressElement() {
        if (!this.canSwitchNext) {
            this.progressElement.innerText = this.submitButtonText;
        } else if (this.canSwitchNext) {
            this.progressElement.innerText = 'next';
        }
    }
    
    private manageStateRegressElement() {
        if (this.progressElement.type == 'submit') {
            this.progressElement.type = 'button';
        }
    
        if (!this.canSwitchPrevious) {
            this.regressElement.disabled = true;
        } else if (this.canSwitchPrevious) {
            this.regressElement.disabled = false;
        }
    }

    private setProgressElement(progressElement: HTMLButtonElement | string ) {
        if (typeof progressElement === 'string') {
            const controller = document.querySelector(progressElement);

            if (controller === null) {
                throw Error('The selector of progressElement is not correct');
            }

            this.progressElement = controller as ProgressElement;
        } else {
            this.progressElement = progressElement;
        }

        this.progressElement.addEventListener('click', () => {
            this.next();
        });
    }

    private setRegressElement(regressElement: HTMLButtonElement | string | undefined) {
        if (regressElement === undefined) {
            return;
        }

        if (typeof regressElement === 'string') {
            const controller = document.querySelector(regressElement);

            if (controller === null) {
                throw Error('The selector of regressElement is not correct');
            }

            this.regressElement = controller as RegressElement;
        } else {
            this.regressElement = regressElement;
        }

        this.regressElement.addEventListener('click', () => {
            this.back();
        });

        this.regressElement.disabled = true;
    }

    private hideCurrent() {
        for (let i = 0; i < this._countShowingItems; i++) {
            this.hideFragment(this._items[this._indexCurrentItem + i]);
        }
    }

    private calculateCountShowingItems() {
        if (this._indexCurrentItem + this.countVisible < this._items.length) {
            this._countShowingItems = this.countVisible;
        } else {
            this._countShowingItems = this._items.length - this._indexCurrentItem;
        }
    }

    private hideFragment(element: FormFragment) {
        element.style.display = 'none';
    }

    private showFragment(element: FormFragment) {
        element.style.display = 'flex';
    }
}