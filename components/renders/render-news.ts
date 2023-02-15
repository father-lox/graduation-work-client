import IRender from "./render.js";
import HTMLNews from '../ui/news/html-news.js';
import ModelNews from "../models/model-news.js";
import HTMLComment from "../ui/comment/html-comment.js";

export default class RenderNews implements IRender {
    constructor() {
        customElements.define('c-news', HTMLNews);
        customElements.define('c-comment', HTMLComment);
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
        const authorCommentNode: HTMLComment = document.createElement('c-comment') as HTMLComment;

        this.setAttributes(newsNode, authorCommentNode, newsModel);

        newsNode.append(authorCommentNode);

        if (place) {
            place.append(newsNode);
        } else {
            return newsNode;
        }
    }

    private setAttributes(newsNode: HTMLNews, authorCommentNode: HTMLComment, model: ModelNews) {
        newsNode.setAttribute('title', model.title);
        newsNode.setAttribute('views', model.countViews.toString());
        newsNode.setAttribute('comments', model.countComments.toString());
        authorCommentNode.setAttribute('nickname', model.authorComment.nickname);
        authorCommentNode.setAttribute('comment', model.authorComment.comment);
        authorCommentNode.setAttribute('slot', 'author-comment');

        if (model.authorComment.isAuthor) {
            authorCommentNode.setAttribute('is-author', '');
        }
    }
}