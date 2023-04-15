import DefaultInput from '../ui-components/inputs/default-input/default-input.js';
import messages from '../messages.js';

export default function validatePassword(password: DefaultInput) {
    return password.validate(messages.passwordIncorrect);
}