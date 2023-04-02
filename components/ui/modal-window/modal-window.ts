export default class ModalWindow {
    constructor(modelId: string, private onModelHide?: CallableFunction) {
        this.modalWindowElement = document.getElementById(modelId) as HTMLDialogElement;
        this.init();
    }

    private modalWindowElement: HTMLDialogElement;
    private classes: { hideAbove: string, hideBelow: string } = {
        hideAbove: 'modal-window_hide-above',
        hideBelow: 'modal-window_hide-below'
    }

    private init() {
        this.initEvents();
    }

    private initEvents() {
        this.modalWindowElement.addEventListener('transitionend', this.onHide);
        this.modalWindowElement.addEventListener('cancel', this.onCancel);
    }

    initHideElement(...elements: HTMLElement[]) {
        elements.forEach(hidingElement => hidingElement.addEventListener('click', this.hide));
    }

    initShowElement(...elements: HTMLElement[]) {
        elements.forEach(showingElement => showingElement.addEventListener('click', this.show));
    }

    show = () => {
        document.body.style.overflow = 'hidden';
        this.modalWindowElement.showModal();
        this.modalWindowElement.classList.remove(this.classes.hideBelow);
    }

    hide = () => {
        this.modalWindowElement.classList.add(this.classes.hideAbove);
    }

    private onHide = () => {
        if (this.modalWindowElement.classList.contains(this.classes.hideAbove)) {
            this.setInitialPosition();

            if (this.onModelHide) {
                this.onModelHide();
            }
        }
    }

    private setInitialPosition = () => {
        this.modalWindowElement.close();
        this.modalWindowElement.classList.remove(this.classes.hideAbove);
        this.modalWindowElement.classList.add(this.classes.hideBelow);
        document.body.style.overflow = 'initial';
    }

    private onCancel = (event: Event) => {
        event.preventDefault();
        this.hide();
    }
}