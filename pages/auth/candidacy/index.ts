import FormPagination from 'code/form-pagination/form-pagination.js';
import HTMLNoteError from 'code/ui-components/note-error/html-note-error.js';
import URLManager from 'code/routes/url-manager.js';
import APIManager from 'code/api/api-manager.js';
import { ApplicationDate } from 'types/api.js';
import DefaultInput from 'code/ui-components/inputs/default-input/default-input.js';

const progressElement: HTMLButtonElement = document.querySelector('#progress') as HTMLButtonElement;
const regressElement: HTMLButtonElement = document.querySelector('#regress') as HTMLButtonElement;
const applicationForm: HTMLFormElement = document.getElementById('candidacy') as HTMLFormElement;
const errorElement: HTMLNoteError = document.getElementById('error') as HTMLNoteError;
const apiManager: APIManager = new APIManager();
Array.from(document.querySelectorAll('.candidacy__input')).map((element) => new DefaultInput(element as HTMLElement))


const numberShownInputs = 1;

new FormPagination({
        fragments: '.default-input',
        progressElement: progressElement,
        regressElement: regressElement,
        submitButtonText: 'send',
        visible: numberShownInputs,
});

applicationForm.addEventListener('submit', sendApplication);

function sendApplication(event: Event) {
    event.preventDefault();

    let applicationData = new FormData(applicationForm);

     //TODO: Use type guard
    let application: ApplicationDate = Object.fromEntries(applicationData.entries()) as unknown as ApplicationDate;

    apiManager.sendApplication(application, onApplicationSended, onApplicationSendingError);
}

function onApplicationSended() {
    alert('Application was sended. We call with you by email');
    redirectToMain();
}

function redirectToMain() {
    location.href = new URLManager().client.main.href;
}

function onApplicationSendingError(errorMessage: string) {
    errorElement.show(errorMessage);
}