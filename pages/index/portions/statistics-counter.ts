import APIManager from '../../../code/api/api-manager.js';
import HTMLNews from '../../../code/ui-components/news/html-news.js';

export default class statisticsCounter {
    public increaseViews = (newsElement: HTMLNews) => {
        this.apiManager.increaseViews(
            newsElement.newsId,
            newsElement.increaseCountViews,
            (message) => console.error(message)
        );
    }

    public increaseComments = (newsElement: HTMLNews) => {
        newsElement.increaseCountComments();
    }

    private apiManager: APIManager = new APIManager();

}