import FormPagination from '../../../code/form-pagination/form-pagination.js';

export default function manageStateFormControllers(formPagination: FormPagination, progressElement: HTMLButtonElement, regressElement: HTMLButtonElement) {
    manageStateProgressElement(formPagination, progressElement);
    manageStateRegressElement(formPagination, progressElement, regressElement);
}

function manageStateProgressElement(formPagination: FormPagination, progressElement: HTMLButtonElement) {
    if (!formPagination.canSwitchNext()) {
        progressElement.innerText = 'register';
    } else if (formPagination.canSwitchNext()) {
        progressElement.innerText = 'next';
    }
}

function manageStateRegressElement(formPagination: FormPagination, progressElement: HTMLButtonElement, regressElement: HTMLButtonElement) {
    if (progressElement.type == 'submit') {
        progressElement.type = 'button';
    }

    if (!formPagination.canSwitchPrevious()) {
        regressElement.disabled = true;
    } else if (formPagination.canSwitchPrevious()) {
        regressElement.disabled = false;
    }
}