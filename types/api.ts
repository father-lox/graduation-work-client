export type ApplicationID = number;

export type Login = string;

export type Nickname = string;

export type APIToken = string;

export type ErrorMessage = string;

export type CheckableUniqueProperties = 'login' | 'nickname';

export type NewsID = number;

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

/* Published Sews */

export type PublishedNews = {
    title: string,
    author_comment?: string,
    sources: Source[],
}

export const enum PublishedNewsFields {
    title = 'title',
    authorComment = 'author_comment',
    sources = 'sources'
}

/* Source */

export type Source = {
    href: string | URL,
    title: string
}

export const enum SourceFields {
    href = 'href',
    title = 'title'
}

/* Readable News */

export type ReadableNews = {
    id: number,
    title: string,
    author_comment?: string,
    nickname: string,
    count_views: number,
    count_comments: number,
    sources: Source[]
}

export const enum ReadableNewsFields {
    id = 'id',
    title = 'title',
    authorComment = 'author_comment',
    nickname = 'nickname',
    countViews = 'count_views',
    countComments = 'count_comments',
    sources = 'sources'
}

/* Submitted Comment */

export type SubmittedComment = {
    news_id: NewsID,
    comment: string,
}

export const enum SubmittedCommentFields {
    newsId = 'news_id',
    comment = 'comment',
}

/* Comment */

export type UserComment = {
    nickname?: string,
    comment: string,
}

export enum UserCommentFields {
    comment = 'comment',
    nickname = 'nickname'
}