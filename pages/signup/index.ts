import FormPagination from 'code/form-pagination/form-pagination.js';
import DefaultInput from 'code/ui-components/inputs/default-input/default-input.js';
import validateUniqueInput from 'code/validation-rules-input/validate-unique-input.js'; 
import validatePassword from 'code/validation-rules-input/validate-password.js'; 
import validatePasswordRequired from 'code/validation-rules-input/validate-password-required.js'; 

const progressElement: HTMLButtonElement = document.querySelector('#progress') as HTMLButtonElement;
const regressElement: HTMLButtonElement = document.querySelector('#regress') as HTMLButtonElement;

const numberShownInputs = 2;

const formPagination = new FormPagination(
    '.sign-up__input',
    numberShownInputs,
    'register'
);

manageStateControllers();

progressElement.addEventListener('click', () => {
    if (validateFormFragment()) {
        formPagination.next();
        manageStateControllers();
    }
});

regressElement.addEventListener('click', () => {
    formPagination.back();
    manageStateControllers();
});

function validateFormFragment(): boolean {
    return validate(...formPagination.currentFields.map(field => new DefaultInput(field)));
}

function validate(...inputs: DefaultInput[]): boolean {
    let areInputsValid = true;
    let isFocused = false;

    inputs.forEach((input: DefaultInput, index, arr) => {
        let isValid = true;

        switch (input.name) {
            case 'login':
                isValid = validateUniqueInput(input, isValueUnique);
                break;
            case 'nickname':
                isValid = validateUniqueInput(input, isValueUnique);
                break;
            case 'password':
                isValid = validatePassword(input);
                break;
            case 'password-required':
                const passwordField = arr.find((input) => input.name === 'password');

                if (!passwordField) {
                    throw Error('Can not find the field with name "password"');
                }

                isValid = validatePasswordRequired(passwordField, input);
                
                break;
            default:
                throw Error('Unexpected input name value')
        }

        if (!isValid) {
            input.showError()
        } else if (isValid && input.isErrorShown) {
            input.showHint();
        }

        if (!isValid && !isFocused) {
            input.focus();
            isFocused = true;
        }

        areInputsValid &&= isValid;
    });

    return areInputsValid;
}

function isValueUnique(value: string): boolean {
    //TODO: Выполнять запрос к серверу и проверять уникальность псевдонима и логина
    return true;
}

function manageStateControllers() {
    manageStateProgressElement();
    manageStateRegressElement();
}

function manageStateProgressElement() {
    if (!formPagination.canSwitchNext()) {
        progressElement.innerText = 'register';
        console.log('From was sended');
    } else if (formPagination.canSwitchNext()) {
        progressElement.innerText = 'next';
    }
}

function manageStateRegressElement() {
    if (!formPagination.canSwitchPrevious()) {
        regressElement.disabled = true;
    } else if (formPagination.canSwitchPrevious()) {
        regressElement.disabled = false;
    }
}
