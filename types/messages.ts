type Messages = {
    fieldRequired: string,
    loginIncorrect: string,
    valueInUse: (fieldName: string) => string,
    passwordIncorrect: string,
    passwordUnconfirmed: string,
    valueTooLong: (max?: number) => string,
    valueTooShort: (min?: number) => string,
}

export default Messages