type Messages = {
    fieldRequired: string,
    loginIncorrect: string,
    passwordIncorrect: string,
    passwordUnconfirmed: string,
    fullName: string,
    valueInUse: (fieldName: string) => string,
    valueTooLong: (max?: number) => string,
    valueTooShort: (min?: number) => string,
}

export default Messages