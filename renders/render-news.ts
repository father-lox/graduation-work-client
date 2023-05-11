import IRender from './render.js';
import RenderComment from './render-comment.js';
import HTMLNews from 'code/ui-components/news/html-news.js';
import HTMLComment from 'code/ui-components/comment/html-comment.js';
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
        let authorCommentNode: HTMLComment | undefined; 
        
        if (newsModel.authorComment) {
            authorCommentNode = this.commentRenderer.renderOne(newsModel.authorComment, true) as HTMLComment;
        }
        
        this.setAttributes(newsNode, newsModel, authorCommentNode);

        if (authorCommentNode) {
            newsNode.append(authorCommentNode);
        }

        if (place) {
            place.append(newsNode);
        } else {
            return newsNode;
        }
    }

    private setAttributes(newsNode: HTMLNews, model: ModelNews, authorCommentNode?: HTMLComment) {
        newsNode.setAttribute('id', model.id.toString());
        newsNode.setAttribute('title', model.title);
        newsNode.setAttribute('views', model.countViews.toString());
        newsNode.setAttribute('comments', model.countComments.toString());
        newsNode.setAttribute(HTMLNews.availableAttributes.sourceLink, model.sources[0].href.toString());
        newsNode.setAttribute(HTMLNews.availableAttributes.sourceTitle, model.sources[0].title);

        if (authorCommentNode) {
            authorCommentNode.setAttribute('slot', 'author-comment');
        }
    }
}