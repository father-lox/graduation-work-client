export default class ModalWindow {
    constructor(modelId: string) {
        this.modalWindowElement = document.getElementById(modelId) as HTMLDialogElement;
        this.init();
    }

    private modalWindowElement: HTMLDialogElement;
    private classes: {hideAbove: string, hideBelow: string} = {
        hideAbove: 'modal-window_hide-above',
        hideBelow: 'modal-window_hide-below'
    }

    show = () => {
        document.body.style.overflow = 'hidden';
        this.modalWindowElement.showModal();
        this.modalWindowElement.classList.remove(this.classes.hideBelow);
    }

    hide = () => {
        this.modalWindowElement.classList.add(this.classes.hideAbove);
    }


    private init() {
        this.initEvents();
    }
    
    private initEvents() {
        this.modalWindowElement.addEventListener('transitionend', this.setInitialPosition);
        this.modalWindowElement.addEventListener('cancel', this.onCancel);

        this.initShowElements();
        this.initHideElements();
    }

    private initHideElements() {
        document.querySelectorAll('[data-role=hide-modal-window]').forEach(hideElement => hideElement.addEventListener('click', this.hide));
    }

    private initShowElements() {
        document.querySelectorAll('[data-role=show-modal-window]').forEach(showElement => showElement.addEventListener('click', this.show));
    }

    private setInitialPosition = () => {
        if (this.modalWindowElement.classList.contains(this.classes.hideAbove)) {
            this.modalWindowElement.close();
            this.modalWindowElement.classList.remove(this.classes.hideAbove);
            this.modalWindowElement.classList.add(this.classes.hideBelow);
            document.body.style.overflow = 'initial';
        }
    }

    private onCancel = (event: Event) => {
        event.preventDefault();
        this.hide();
    }
}