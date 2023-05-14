import autoResizeHeightTextarea from 'code/ui-components/inputs/expressive-input/auto-resize-height-textarea.js'
import DefaultInput from 'code/ui-components/inputs/default-input/default-input.js';
import { PublishedNews } from 'types/api.js';
import { isNewsData } from 'types/type-guards.js';
import APIManager from 'code/api/api-manager.js';
import URLManager from 'code/routes/url-manager';

autoResizeHeightTextarea(document.getElementById('news-title') as HTMLTextAreaElement);

const inputs: DefaultInput[] = Array.from(document.querySelectorAll('.news-form__input')).map(input => new DefaultInput(input as HTMLDivElement)) as DefaultInput[];
const form: HTMLFormElement = document.getElementById('news-form') as HTMLFormElement;
const apiManager: APIManager = new APIManager();
const urlManager: URLManager = new URLManager();

form.addEventListener('submit', sendNews);

function sendNews(event: Event) {
    event.preventDefault();

    const formData = new FormData(form);

    try {
        apiManager.postNews(buildNews(formData), onSuccess, onReject);
    } catch (error) {
        if (error instanceof Error) {
            alert(error.message)
        } else {
            alert('Some error');
        }
    }
}

function buildNews(formData: FormData): PublishedNews {
    let news: any = {
        title: formData.get('title'),
        sources: [
            {
                href: formData.get('href'),
                title: formData.get('article_title'),
            }
        ]
    };

    const authorComment = formData.get('author_comment') as string || null;

    if (authorComment !== null && authorComment.length > 0) {
        news['author_comment'] = formData.get('author_comment');
    }

    if (isNewsData(news)) {
        return news;
    } else {
        throw Error('Incorrect form structure');
    }
}

function onSuccess(): void {
    alert('News was public');
    location.href = urlManager.client.main.href;
}

function onReject(message: string, errorCode: number): void {
    if (errorCode === 401) {
        alert(message);
        location.href = urlManager.client.loginAuthor.href;
    } else {
        alert(message);
    }
}