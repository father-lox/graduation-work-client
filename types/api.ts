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

/**
 * Signup user data  
 */
export type RegistrationData = {
    application_id: ApplicationID,
    login: Login,
    nickname: Nickname,
    password: string,
    password_confirmation: string,
}
