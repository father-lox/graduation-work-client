import ModelComment from "../models/model-comment.js";
import HTMLComment from '../ui/comment/html-comment.js';

export default class RenderComment {
    constructor() {
        if (!customElements.get('c-comment')) {
            customElements.define('c-comment', HTMLComment);
        }
    }

    renderMany(commentsModels: Array<ModelComment>, place?: HTMLElement): HTMLComment[] | void {
        const commentsNodes: HTMLComment[] = [];

        commentsModels.forEach(commentModel => {
            place ? this.renderOne(commentModel, place) : commentsNodes.push(this.renderOne(commentModel) as HTMLComment);
        });

        if (commentsNodes.length) {
            return commentsNodes;
        }
    }

    renderOne(commentModel: ModelComment, place?: HTMLElement): HTMLComment | void {
        const commentNode: HTMLComment = document.createElement('c-comment') as HTMLComment;

        this.setAttributes(commentNode, commentModel);

        if (place) {
            place.append(commentNode);
        } else {
            return commentNode;
        }
    }

    setAttributes(commentNode: HTMLComment, commentModel: ModelComment) {
        commentNode.setAttribute('nickname', commentModel.nickname);
        commentNode.setAttribute('comment', commentModel.comment);
        if (commentModel.isAuthor) {
            commentNode.setAttribute('is-author', '');
        }
    }
}