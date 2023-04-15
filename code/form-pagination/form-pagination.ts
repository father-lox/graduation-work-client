export default class FormPagination {
    constructor(
        items: HTMLElement[] | string,
        visible: number = 1,
        textButtonSubmittingForm: string = 'send',
        progressElement?: HTMLButtonElement | string | undefined,
        regressElement?: HTMLButtonElement | string | undefined,
    ) {
        if (typeof items === 'string') {
            const elements = document.querySelectorAll(items);

            if (!elements.length) {
                throw Error('The selector of items is not correct');
            }

            this._items = Array.from(elements) as HTMLElement[];
        } else {
            this._items = items;
        }

        this.textButtonSubmittingForm = textButtonSubmittingForm;
        this.countVisible = visible;
        this.calculateCountShowingItems();
        this.init();
        this.setProgressElement(progressElement);
        this.setRegressElement(regressElement);
    }

    next() {
        if (this.canSwitchNext()) {
            this.hideCurrent();

            this._indexCurrentItem += this.countVisible;
            this.calculateCountShowingItems();

            for (let i = 0; i < this._countShowingItems; i++) {
                this.showElement(this._items[this._indexCurrentItem + i]);
            }
        }

        this.setStateControllers();
    }

    back() {
        if (this.canSwitchPrevious()) {
            this.hideCurrent();

            this._indexCurrentItem -= this.countVisible;
            this.calculateCountShowingItems();

            for (let i = 0; i < this._countShowingItems; i++) {
                this.showElement(this._items[this._indexCurrentItem + i]);
            }
        }

        this.setStateControllers();
    }


    canSwitchNext(): boolean {
        return this._indexCurrentItem < this._items.length - this.countVisible;
    }

    canSwitchPrevious(): boolean {
        return this._indexCurrentItem !== 0;
    }

    get indexCurrentItem(): number {
        return this._indexCurrentItem;
    }

    get currentFields(): HTMLElement[] {
        return this._items.slice(this._indexCurrentItem, this._indexCurrentItem + this._countShowingItems);
    }

    private progressElement: HTMLButtonElement | undefined;
    private regressElement: HTMLButtonElement | undefined;
    private textButtonSubmittingForm: string;
    private countVisible: number;
    private _items: HTMLElement[];
    private _indexCurrentItem = 0;
    private _countShowingItems = 0;

    private init() {
        for (let i = this.countVisible; i < this._items.length; i++) {
            this.hideElement(this._items[i]);
        }

        this.setStateControllers();
    }

    private setStateControllers() {
        this.manageStateProgressElement();
        this.manageStateRegressElement();
    }

    private manageStateProgressElement() {
        if (!this.canSwitchNext() && this.progressElement && !this.progressElement.disabled) {
            this.progressElement.type = 'submit';
            this.progressElement.innerText = this.textButtonSubmittingForm;
        } else if (this.canSwitchNext() && this.progressElement && this.progressElement.disabled) {
            this.progressElement.type = 'button';
            this.progressElement.innerText = 'next';
        }
    }

    private manageStateRegressElement() {
        if (!this.canSwitchPrevious() && this.regressElement && !this.regressElement.disabled) {
            this.regressElement.disabled = true
        } else if (this.canSwitchPrevious() && this.regressElement && this.regressElement.disabled) {
            this.regressElement.disabled = false;
        }
    }

    private setProgressElement(progressElement: HTMLButtonElement | string | undefined) {
        if (progressElement === undefined) {
            return;
        }

        if (typeof progressElement === 'string') {
            const controller = document.querySelector(progressElement);

            if (controller === null) {
                throw Error('The selector of progressElement is not correct');
            }

            this.progressElement = controller as HTMLButtonElement;
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

            this.regressElement = controller as HTMLButtonElement;
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
            this.hideElement(this._items[this._indexCurrentItem + i]);
        }
    }

    private calculateCountShowingItems() {
        if (this._indexCurrentItem + this.countVisible < this._items.length) {
            this._countShowingItems = this.countVisible;
        } else {
            this._countShowingItems = this._items.length - this._indexCurrentItem;
        }
    }

    private hideElement(element: HTMLElement) {
        element.style.display = 'none';
    }

    private showElement(element: HTMLElement) {
        element.style.display = 'flex';
    }
}