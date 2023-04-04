import IRender from './render.js';
import RenderComment from './render-comment.js';
import HTMLNews from 'components/ui/news/html-news.js';
import HTMLComment from 'components/ui/comment/html-comment.js';
import ModelNews from 'models/model-news.js';

export default class RenderNews implements IRender {
    constructor(private commentRenderer = new RenderComment()) {
        if (!customElements.get('c-news')) {
            customElements.define('c-news', HTMLNews);
        }
    }

    renderMany(newsModels: Array<ModelNews>, place?: HTMLElement): HTMLNews[] | void {
        const newsNodes: HTMLNews[] = [];

        newsModels.forEach(newsModel => {
            place ? this.renderOne(newsModel, place) : newsNodes.push(this.renderOne(newsModel) as HTMLNews);
        });

        if (newsNodes.length) {
            return newsNodes;
        }
    }

    renderOne(newsModel: ModelNews, place?: HTMLElement): HTMLNews | void {
        const newsNode: HTMLNews = document.createElement('c-news') as HTMLNews;
        const authorCommentNode: HTMLComment = this.commentRenderer.renderOne(newsModel.authorComment) as HTMLComment;
        this.setAttributes(newsNode, authorCommentNode, newsModel);

        newsNode.append(authorCommentNode);

        if (place) {
            place.append(newsNode);
        } else {
            return newsNode;
        }
    }

    private setAttributes(newsNode: HTMLNews, authorCommentNode: HTMLComment, model: ModelNews) {
        newsNode.setAttribute('id', model.id.toString());
        newsNode.setAttribute('title', model.title);
        newsNode.setAttribute('views', model.countViews.toString());
        newsNode.setAttribute('comments', model.countComments.toString());
        authorCommentNode.setAttribute('slot', 'author-comment');
    }
}