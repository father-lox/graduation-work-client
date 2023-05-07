import FormPagination from 'code/form-pagination/form-pagination.js';
import DefaultInput from 'code/ui-components/inputs/default-input/default-input.js';
import HTMLNoteError from 'code/ui-components/note-error/html-note-error.js';
import APIManager from 'code/api/api-manager.js';
import { ErrorMessage, RegistrationData, RegistrationDataFields } from 'types/api.js';
import { FormFragment } from '../../../types/form-pagination.js';
import { CheckableUniqueProperties } from '../../../types/api.js'
import messages from 'code/messages.js';


const urlPage: URL = new URL(location.href);
const applicationId: number | null = urlPage.searchParams.get('application_id') === null ? null : Number(urlPage.searchParams.get('application_id'));

preventRegistration();

customElements.get(HTMLNoteError.tagName) || customElements.define(HTMLNoteError.tagName, HTMLNoteError);

const progressElement: HTMLButtonElement = document.querySelector('#progress') as HTMLButtonElement;
const regressElement: HTMLButtonElement = document.querySelector('#regress') as HTMLButtonElement;
const signUpForm: HTMLFormElement = document.getElementById('sign-up') as HTMLFormElement;
const errorElement: HTMLNoteError = document.getElementById('error') as HTMLNoteError;
const fields: DefaultInput[] = Array.from(document.querySelectorAll('.form__input')).map((element) => new DefaultInput(element as HTMLElement))


const apiManager = new APIManager();

const numberShownInputs = 2;

new FormPagination({
    fragments: fields.map(field => field.field),
    visible: numberShownInputs,
    validateAdditional: validatePasswordConfirmationAndUniqueValue,
    submitButtonText: 'register',
    progressElement: progressElement,
    regressElement: regressElement
});

signUpForm.addEventListener('submit', onSignup);

function preventRegistration() {
    if (applicationId === null) {
        alert('Registration is unavailable.');
        //TODO: Show message about incorrect URL
        //TODO: Redirect to news page
        throw Error('Registration is unavailable.');
    }
}

async function onSignup(event: Event) {
    event.preventDefault();

    if (applicationId === null) {
        throw new Error('application id is not set');
    }

    let formData = new FormData(signUpForm);
    formData.set('application_id', applicationId.toString());

     //TODO: Use type guard
    let user: RegistrationData = Object.fromEntries(formData.entries()) as unknown as RegistrationData;

    apiManager.signup(user, onUserCreated, onFailedToCreateUser);
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

async function validatePasswordConfirmationAndUniqueValue(fragment: FormFragment): Promise<boolean> {
    const input: DefaultInput | undefined = fields.find(field => fragment === field.field);
    
    if (input === undefined) {
        throw Error('Can not find fragment in fields');
    }

    let errorMessage = '';
    let isValid = true;

    // Processing specific input validation
    if (input.name === RegistrationDataFields.login || input.name === RegistrationDataFields.nickname) {
        isValid = await apiManager.isValueUnique(input.name as CheckableUniqueProperties, input.value);
        errorMessage = messages.valueInUse(input.name);
    } else if (input.name === RegistrationDataFields.password_confirmation) {
        const passwordField: DefaultInput | undefined = fields.find((field) => field.name === RegistrationDataFields.password);

        if (passwordField === undefined) {
            throw Error(`Can not find the field with name ${RegistrationDataFields.password}`);
        }

        isValid = passwordField.value === input.value;
        errorMessage = messages.passwordUnconfirmed;
    }

    if (!isValid) {
        //Display specific input validation error, if input is incorrect
        input.displayInputError(errorMessage)
    } 
    else if (isValid && input.isErrorShown) {
        //Hide errors, if input correct
        input.displayInputHint();
    }

    return isValid;
}
