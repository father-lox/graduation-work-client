import APIManager from 'code/api/api-manager.js';
import HTMLNoteError from 'code/ui-components/note-error/html-note-error.js';
import URLManager from 'code/url-manager.js';
import { isLoginData } from 'types/type-guards.js';
import DefaultInput from 'code/ui-components/inputs/default-input/default-input.js';

customElements.get(HTMLNoteError.tagName) || customElements.define(HTMLNoteError.tagName, HTMLNoteError);

const noteErrorElement: HTMLNoteError = document.getElementById('error-form') as HTMLNoteError;
const loginForm: HTMLFormElement = document.getElementById('login-form') as HTMLFormElement;
const urlManager: URLManager = new URLManager();
const apiManager: APIManager = new APIManager();
Array.from(document.querySelectorAll('.form__input')).map((element) => new DefaultInput(element as HTMLElement))

loginForm.addEventListener('submit', onFormSubmit);

function onFormSubmit(event: Event) {
    event.preventDefault();

    let loginData = new FormData(loginForm);

    let user = Object.fromEntries(loginData.entries());

    if (isLoginData(user)) {
        apiManager.login(user, onLogin, onLoginError);
    } else {
        console.error('Incorrect object structure');
    }

}

function onLogin() {
    location.href = urlManager.client.href;
}

function onLoginError(errorMessage: string) {
    noteErrorElement.show(errorMessage);
}