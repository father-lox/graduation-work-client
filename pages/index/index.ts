import ModelNews from 'models/model-news.js';
import HTMLNews from 'code/ui-components/news/html-news.js';
import ScreenScrolling from 'code/ui-components/screen-scrolling/screen-scrolling.js';
import RenderNews from 'renders/render-news.js'
import CommentsManger from './portions/comments/comments-manager.js';
import CommentForm from './portions/comments/comment-form.js';
import Header from 'code/ui-components/header/header.js';

new Header();
const commentsManger = new CommentsManger();

commentsManger.init();

const rendererNews: RenderNews = new RenderNews();
const newsContainer: HTMLDivElement = document.querySelector('.news-section') as HTMLDivElement;
const newsElements: HTMLNews[] = [];
let currentNews: number = 0;

if (!newsContainer) {
    throw new Error(".news-section is undefined");
}


new ScreenScrolling(newsContainer, newsElements, loadNews);

new CommentForm(document.getElementById('comment-form') as HTMLFormElement, commentsManger.insertComment, onReject);


async function loadNews(): Promise<HTMLNews[] | null> {
    const modelsNews: ModelNews[] | null = await ModelNews.getNews();

    if (!modelsNews) {
        return null;
    }

    return rendererNews.renderMany(modelsNews) as HTMLNews[];
}

function onReject() {
    alert('Comment was not sended');
}
