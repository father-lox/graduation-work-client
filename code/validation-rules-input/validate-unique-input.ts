import DefaultInput from '../ui-components/inputs/default-input/default-input.js';
import messages from '../messages.js';

export default function validateUniqueInput(input: DefaultInput, checkUniqueValue: (value: string) => boolean): boolean {
    let isValid = true;
    isValid = isValid && input.validate(messages.loginIncorrect);

    if (!checkUniqueValue(input.value) && isValid) {
        input.errorMessage += ` ${messages.valueInUse(input.name)}`;
        input.errorMessage.trim();
        isValid = isValid && false;
    }

    return isValid;
}