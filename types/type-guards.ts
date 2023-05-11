import {
    LoginDataFields, 
    LoginData,
    PublishedNews,
    PublishedNewsFields,
    Source,
    SourceFields,
    UserCommentFields,
    UserComment
} from './api.js';

/* Login Data */

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

/* News */

export function isNewsData(value: any): value is PublishedNews {
    const isObj = isObject(value);
    const hasTitle = PublishedNewsFields.title in value && typeof value.title === 'string';
    const isCommentCorrect = !(PublishedNewsFields.authorComment in value) || (PublishedNewsFields.authorComment in value && typeof value.author_comment === 'string')
    const hasSources = PublishedNewsFields.sources in value && Array.isArray(value.sources);
    const isSourcesCorrect = checkSources(value.sources);


    if (!(isObj && hasTitle && isCommentCorrect && hasSources && isSourcesCorrect)) {
        return false;
    }

    return true;

    function checkSources(sources: any): boolean {
        for (const source of sources) {
            if (!isSource(source)) {
                return false;
            }
        }

        return true;
    }
}

export function isSource(value: any): value is Source {
    const isObj = isObject(value);
    const hasHref = SourceFields.href in value && typeof value.href === 'string';
    const hasTitle = SourceFields.title in value && typeof value.title === 'string';

    if (isObj && hasHref && hasTitle) {
        return true;
    }

    return false;
}

/* Comment */

export function isUserComment(value: any): value is UserComment {
    const isObj = isObject(value);
    const hasComment = UserCommentFields.comment in value;

    return isObj && hasComment;
}

/* Readable News */
//TODO: Add type Guard for ReadableNews

function isObject(value: unknown): value is {} {
    return typeof value === 'object' && value !== null
}