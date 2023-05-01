import FormPagination from 'code/form-pagination/form-pagination.js';
import DefaultInput from 'code/ui-components/inputs/default-input/default-input.js';
import HTMLNoteError from 'code/ui-components/note-error/html-note-error.js';
import APIManager from 'code/api/api-manager.js';
import { ErrorMessage, RegistrationData } from 'types/api.js';
import manageStateFormControllers from './code/manage-form-state.js';
import validate from './code/signup-validator.js'

const urlPage: URL = new URL(location.href);
const applicationId: number | null = urlPage.searchParams.get('application_id') === null ? null : Number(urlPage.searchParams.get('application_id'));

preventRegistration();

customElements.get(HTMLNoteError.tagName) || customElements.define(HTMLNoteError.tagName, HTMLNoteError);

const progressElement: HTMLButtonElement = document.querySelector('#progress') as HTMLButtonElement;
const regressElement: HTMLButtonElement = document.querySelector('#regress') as HTMLButtonElement;
const signUpForm: HTMLFormElement = document.getElementById('sign-up') as HTMLFormElement;
const errorElement: HTMLNoteError = document.getElementById('error') as HTMLNoteError;

const apiManager = new APIManager();

const numberShownInputs = 2;

const formPagination = new FormPagination('.form__input', numberShownInputs, 'register');

manageStateFormControllers(formPagination, progressElement, regressElement);

progressElement.addEventListener('click', onNext);
regressElement.addEventListener('click', onBack);
signUpForm.addEventListener('submit', onSignup);



function preventRegistration() {
    if (applicationId === null) {
        //TODO: Show message about incorrect URL
        //TODO: Redirect to news page
        throw Error('Registration is unavailable.');
    }
}

async function onNext() {
    validate(...getCurrentFormInputs()).then(isFormValid => {
        if (isFormValid && formPagination.canSwitchNext()) {
            formPagination.next();
            manageStateFormControllers(formPagination, progressElement, regressElement);
        } else if (isFormValid) {
            progressElement.type = 'submit';
        }
    });
}

function onBack() {
    formPagination.back();
    manageStateFormControllers(formPagination, progressElement, regressElement);
}

async function onSignup(event: Event) {
    event.preventDefault();

    if (applicationId === null) {
        throw new Error('application id is not set');
    }

    let formData = new FormData(signUpForm);
    formData.set('application_id', applicationId.toString());

    let user: RegistrationData = Object.fromEntries(formData.entries()) as unknown as RegistrationData;

    apiManager.signup(user, onUserCreated, onFailedToCreateUser);
}

function getCurrentFormInputs(): DefaultInput[] {
    return formPagination.currentFields.map(field => new DefaultInput(field))
}

function onUserCreated() {
    if (errorElement.isShown) {
        errorElement.hide();
    }

    //TODO: Redirect to user profile page
    location.href = 'http://127.0.0.1:5500/pub/pages/login/login.html'
}

function onFailedToCreateUser(message: ErrorMessage) {
    errorElement.show(message);
}
