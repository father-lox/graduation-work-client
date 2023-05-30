import ModelNews from 'models/model-news.js';
import HTMLNews from 'code/ui-components/news/html-news.js';
import ScreenScrolling from 'code/ui-components/screen-scrolling/screen-scrolling.js';
import RenderNews from 'renders/render-news.js'
import CommentsManger from './portions/comments/comments-manager.js';
import CommentForm from './portions/comments/comment-form.js';
import Header from 'code/ui-components/header/header.js';
import { UserComment } from 'types/api.js';
import ShareNews from './portions/share-news.js';
import StatisticsCounter from './portions/statistics-counter.js';

new Header();
const commentsManger = new CommentsManger();
const statisticsCounter = new StatisticsCounter();
const shareNews = new ShareNews();

commentsManger.init();

const rendererNews: RenderNews = new RenderNews();
const newsContainer: HTMLDivElement = document.querySelector('.news-section') as HTMLDivElement;
const newsElements: HTMLNews[] = [];
const commentForm = document.getElementById('comment-form') as HTMLFormElement
await loadSharedNews();

if (!newsContainer) {
    throw new Error(".news-section is undefined");
}

const screenScrolling = new ScreenScrolling(newsContainer, newsElements, loadNews);

document.addEventListener(ScreenScrolling.availableEvents.screenWatched, onNewsWatched);
new CommentForm(commentForm, onAddCommentSuccess, onAddCommentReject);

async function loadNews(): Promise<HTMLNews[] | null> {
    const modelsNews: ModelNews[] | null = await ModelNews.getManyNews();

    if (!modelsNews) {
        return null;
    }

    return rendererNews.renderMany(modelsNews) as HTMLNews[];
}

function onNewsWatched(event: Event) {
    statisticsCounter.increaseViews(event.target as HTMLNews);
} 

function onAddCommentSuccess(comment: UserComment) {
    commentsManger.insertComment(comment);
    statisticsCounter.increaseComments(newsElements[screenScrolling.currentScreenNumber]);
}

function onAddCommentReject() {
    alert('Comment was not sended');
}

async function loadSharedNews() {
    if (!shareNews.isShareLink()) {
        return;
    }

    let shareNewsModel = await ModelNews.getOneNews(shareNews.getShredNewsId() as number);

    if (!shareNewsModel) {
        return;
    }

    newsElements.unshift(rendererNews.renderOne(shareNewsModel) as HTMLNews);
}