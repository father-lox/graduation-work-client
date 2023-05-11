import { NewsID, SubmittedComment, UserComment } from '../../../../types/api.js';
import APIManager from '../../../../code/api/api-manager.js';

export default class CommentForm {
    constructor(
        private commentForm: HTMLFormElement,
        private onSuccess: (comment: UserComment) => void | {},
        private onReject: () => void | {}) {
        if (!this.commentForm.querySelector(`[name=${this.nameInputComment}]`)) {
            throw new Error(`Could not find input with name "${this.nameInputComment}"`);
        }

        document.addEventListener('show-comments', this.updateNewsID as EventListener);
        this.commentForm.addEventListener('submit', this.sendComment);
    }

    private newsID: NewsID | undefined;
    private apiManager: APIManager = new APIManager();
    private nameInputComment = 'comment';

    private updateNewsID = (event: CustomEvent) => {
        this.newsID = event.detail.newsId
    }

    private sendComment = (event: Event) => {
        event.preventDefault();
    
        const message: string = new FormData(this.commentForm).get(this.nameInputComment) as string;
    
        if (!(message.length > 0 && this.newsID)) {
            throw new Error('Sending a comment failed')
        }

        const submittedComment: SubmittedComment = {
            comment: message,
            news_id: this.newsID,
        }

        this.apiManager.sendComment(submittedComment, (comment: UserComment) => {
            this.commentForm.reset();
            this.onSuccess(comment);
        }, this.onReject);
    }
}