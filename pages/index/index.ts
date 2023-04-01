import ModelNews from "../../components/models/model-news.js";
import HTMLNews from "../../components/ui/news/html-news.js";
import ScreenScrolling from "../../components/ui/screen-scrolling/screen-scrolling.js";
import RenderNews from '../../components/renders/render-news.js'
import CommentsManger from './portions/comments/comments-manager.js';

new CommentsManger().init();

const rendererNews: RenderNews = new RenderNews();
const newsContainer: HTMLDivElement = document.querySelector('.news-section') as HTMLDivElement;
const newsElements: HTMLNews[] = [];
let currentNews: number = 0;

if (!newsContainer) {
    throw new Error(".news-section is undefined");
}


new ScreenScrolling(newsContainer, newsElements, loadNews);


async function loadNews(): Promise<HTMLNews[]> {
    const modelsNews: ModelNews[] = await ModelNews.getNews();
    return rendererNews.renderMany(modelsNews) as HTMLNews[];
}
