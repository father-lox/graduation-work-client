export type ApplicationID = number;

export type Login = string;

export type Nickname = string;

export type APIToken = string;

export type ErrorMessage = string;

export type CheckableUniqueProperties = 'login' | 'nickname';

/**
 * Объект API ссылок, приходящих ответом от сервера
 */
export type APILinksNavigator = {
    first: string,
    last: string,
    prev: string | null,
    next: string | null,
}

/* Signup */

 //TODO: Add type guard function

export type RegistrationData = {
    application_id: ApplicationID,
    login: Login,
    nickname: Nickname,
    password: string,
    password_confirmation: string,
}

export const enum RegistrationDataFields {
    login = 'login',
    nickname = 'nickname',
    password = 'password',
    password_confirmation = 'password_confirmation',
    application_id = 'application_id',
}

 /* Application */

 //TODO: Add type guard function

export type ApplicationDate = {
    full_name: string,
    email: string,
    message: string,
}

export const enum ApplicationDataFields {
    fullName = 'full_name',
    email = 'email',
    message = 'message',
}

/* Login */

export type LoginData = {
    login: string,
    password: string,
}

export const enum LoginDataFields {
    login = 'login',
    password = 'password',
}

export function isLoginData(value: any): value is LoginData {
    if (isObject(value) &&
        LoginDataFields.login in value &&
        typeof value[LoginDataFields.login] === 'string' &&
        LoginDataFields.password in value &&
        typeof value[LoginDataFields.password] === 'string'
        ) {
            return true;
        }

    return false;
}

function isObject(value: unknown): value is {} {
    return typeof value === 'object' && value !== null
}