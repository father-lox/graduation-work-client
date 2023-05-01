import messages from '../../../code/messages.js';
import DefaultInput from '../../../code/ui-components/inputs/default-input/default-input.js';
import APIManager from '../../../code/api/api-manager.js';

const apiManager = new APIManager();

const enum availableNamesFields {
    login = 'login',
    nickname = 'nickname',
    password = 'password',
    password_confirmation = 'password_confirmation',
    application_id = 'application_id',
}

export default async function validate(...inputs: DefaultInput[]): Promise<boolean> {
    let areInputsValid = true;
    let isFocused = false;

    for (const input of inputs) {
        let isValid = input.validate(input.name === availableNamesFields.password ? messages.passwordIncorrect : undefined);

        if (!isValid) {
            if (!isFocused) {
                //Set the focus to the first incorrect input, if it is not already set
                input.focus();
                isFocused = true;
            }

            areInputsValid &&= isValid;

            continue;
        }

        let errorMessage = '';

        //Processing specific input validation
        if (input.name === availableNamesFields.login || input.name === availableNamesFields.nickname) {
            isValid = await apiManager.isValueUnique(input.name, input.value);
            errorMessage = messages.valueInUse(input.name);
        } else if (input.name === availableNamesFields.password_confirmation) {
            const passwordField = inputs.find((input) => input.name === availableNamesFields.password);

            if (!passwordField) {
                throw Error(`Can not find the field with name ${availableNamesFields.password}`);
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

        //Set the focus to the first incorrect input, if it is not already set
        if (!isValid && !isFocused) {
            input.focus();
            isFocused = true;
        }

        areInputsValid &&= isValid;
    }

    return areInputsValid;
}