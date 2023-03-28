/**
 * Объект API ссылок, приходящих ответом от сервера
 */
type APILinksNavigator = {
    first: string,
    last: string,
    prev: string | null,
    next: string | null,
}

export default APILinksNavigator;