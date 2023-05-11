import { UserComment } from 'types/api.js';
import HTMLComment from 'code/ui-components/comment/html-comment.js';
import getRandomEmoji from 'code/get-random-emoji.js';

export default class RenderComment {
    constructor() {
        if (!customElements.get('c-comment')) {
            customElements.define('c-comment', HTMLComment);
        }
    }

    renderMany(commentsModels: UserComment[], isAuthor?: boolean): HTMLComment[] {
        const commentsNodes: HTMLComment[] = new Array(commentsModels.length);

        commentsModels.forEach((commentModel, index) => {
            commentsNodes[index] = this.renderOne(commentModel, isAuthor);
        });

        return commentsNodes;
    }

    renderOne(commentModel: UserComment, isAuthor?: boolean): HTMLComment {
        const commentNode: HTMLComment = document.createElement('c-comment') as HTMLComment;

        this.setAttributes(commentNode, commentModel, isAuthor);

        return commentNode;
    }

    setAttributes(commentNode: HTMLComment, commentModel: UserComment, isAuthor?: boolean) {
        const autograph = `Comment ${commentModel.nickname ? `by @${commentModel.nickname}` : `from ${getRandomEmoji()}`}` 

        commentNode.setAttribute(HTMLComment.availableAttributes.autograph, autograph);
        commentNode.setAttribute(HTMLComment.availableAttributes.comment, commentModel.comment);

        if (isAuthor) {
            commentNode.setAttribute('is-author', '');
        }
    }
}