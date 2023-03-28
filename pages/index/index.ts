import ModelNews from "../../components/models/model-news.js";
import HTMLNews from "../../components/ui/news/html-news.js";
import RenderNews from '../../components/renders/render-news.js'
import CommentsManger from './portions/comments/comments-manager.js';

new CommentsManger().init();

const rendererNews: RenderNews = new RenderNews();
const newsContainer: HTMLDivElement = document.querySelector('.news-section') as HTMLDivElement;
const nodesNews: HTMLNews[] = [];
let currentNews: number = 0;

if (!newsContainer) {
    throw new Error(".news-section is undefined");
}

updateNewsFeed().then(() => {nodesNews[currentNews].style.display = 'block'});


window.addEventListener('keydown', (event) => {
    if (event.code === 'ArrowDown' && !event.repeat) {
        switchToNextNews();
    }
    else if (event.code === 'ArrowUp' && !event.repeat) {
        switchToPreviousNews();
    }
});

newsContainer.addEventListener('wheel', event => {
    if (event.deltaY > 0) {
        switchToNextNews();
    }
    else if (event.deltaY < 0) {
        switchToPreviousNews();
    }
});

async function loadNews(): Promise<HTMLNews[]> {
    const modelsNews: ModelNews[] = await ModelNews.getNews();
    return rendererNews.renderMany(modelsNews) as HTMLNews[];
}

async function updateNewsFeed() {
    (await loadNews()).forEach(node => {
        node.style.display = 'none'
        newsContainer.append(node);
        nodesNews.push(node);
    });
}

function switchToNextNews() {
    if (window.pageYOffset !== window.scrollY) {
        return;
    }

    if (currentNews + 1 < nodesNews.length) {
        nodesNews[currentNews].style.display = 'none';
        currentNews++;   
        nodesNews[currentNews].style.display = 'block';
    }
    if (currentNews === nodesNews.length - 1) {
        updateNewsFeed();
    }

    window.scroll(0, 0);
}

function switchToPreviousNews() {
    if (currentNews > 0 && window.pageYOffset === 0) {
        nodesNews[currentNews].style.display = 'none';
        currentNews--;
        nodesNews[currentNews].style.display = 'block';
    }
}