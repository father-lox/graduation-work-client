import Messages from "../types/messages.js";

//TODO: Add pass ganerator

const messages: Messages = {
    fieldRequired: 'This field is required',
    loginIncorrect: 'The login value can only contain latin characters, digits and some special characters ".", "_", "-".',
    passwordIncorrect: `Password is easy. Use a combination of at least 8 characters of digits, uppercase and lowercase letters, and non-alpha numeric numbers. Example: |YlzEc|1`,
    passwordUnconfirmed: 'Passwords do not match',
    fullName: 'Write your full name in Latin letters. Available characters ",", ".", "\'", "-"',
    valueInUse: (fieldName: string) => `The ${fieldName} is already in use`,
    valueTooLong: (max: number = 16) => `Max length of the value is ${max} characters`,
    valueTooShort: (min: number = 4) => `Min length of the value is ${min} characters`,
}

export default messages;