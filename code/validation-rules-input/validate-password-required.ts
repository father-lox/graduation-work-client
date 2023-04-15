import DefaultInput from '../ui-components/inputs/default-input/default-input.js';
import messages from '../messages.js';

export default function validatePasswordRequired(passwordField: DefaultInput, passwordRequired: DefaultInput) {
    const isValid = passwordField.value === passwordRequired.value && passwordRequired.validate();
    passwordRequired.errorMessage = messages.passwordUnconfirmed;

    return isValid;
}