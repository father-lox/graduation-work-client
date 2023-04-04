import ModelComment from 'models/model-comment.js';
import RenderComment from 'renders/render-comment.js';
import UserComment from 'types/user-comment.js';
import HTMLComment from 'components/ui/comment/html-comment.js';
import ModalWindow from 'components/ui/modal-window/modal-window.js';
import autoResizeHeightTextarea from 'components/ui/inputs/expressive-input/auto-resize-height-textarea.js'

export default class CommentsManager {
    constructor(
        private commentsSectionElement: HTMLDivElement = document.getElementById('comment-section') as HTMLDivElement,
        private commentsListElement: HTMLDivElement = document.getElementById('comment-list') as HTMLDivElement,
        private backToNewsElement: HTMLButtonElement = document.getElementById('back-to-news') as HTMLButtonElement,
        private commentField: HTMLTextAreaElement = document.getElementById('comment-field') as HTMLTextAreaElement,
        private commentRenderer = new RenderComment()
    ) {
        autoResizeHeightTextarea(this.commentField);
    }

    private currentNewsId: number = 0;
    private previousNewsId: number | undefined;
    private comments: UserComment[] = [];
    private commentsNodes: HTMLComment[] = [];
    private canUpdateComments: Boolean = true;
    private loadTrigger: number = 100;

    init() {
        this.initEvents();
    }

    private hideComments = () => {
        for (let index = this.commentsNodes.length - 1; index >= 0; index--) {
            this.setAnimationRules(this.commentsNodes[index]);
        }
    }

    private commentModelWindow: ModalWindow = new ModalWindow('comment-section', this.hideComments);

    private initEvents() {
        document.querySelector('.news-section')?.addEventListener('show-comments', (this.onNewsSectionShowComments as EventListener));
        this.commentModelWindow.initHideElement(this.backToNewsElement);
        this.commentsSectionElement.addEventListener('scroll', this.onScrollToBottom);
    }

    private onScrollToBottom: EventListener = () => {
        if (this.canUpdateComments && ModelComment.canLoadAdditionalComments()) {
            const scrollTop = this.commentsSectionElement.scrollTop;
            const viewHight = this.commentsSectionElement.clientHeight;
            const scrollHeight = this.commentsSectionElement.scrollHeight;

            if (scrollTop + viewHight + this.loadTrigger >= scrollHeight) {
                this.loadAndRenderAdditionalComments();
                this.canUpdateComments = false;
            }
        }
    }

    private onNewsSectionShowComments = (event: CustomEvent) => {
        this.canUpdateComments = true;
        this.currentNewsId = event.detail.newsId;
        this.loadAndRenderInitialComments(this.currentNewsId);
        this.commentModelWindow.show();
    }

    private loadAndRenderInitialComments(newsId: number) {
        this.setComments(newsId).then(() => {
            this.renderComments(newsId)
            this.previousNewsId = newsId;
        }).catch(error => console.error(error));
    }

    private loadAndRenderAdditionalComments = async () => {
        const modelComments: UserComment[] | null = await ModelComment.fetchAdditionalUserComments();

        if (modelComments === null) {
            this.canUpdateComments = false;
        } else {
            this.attachCommentsNodes(modelComments, true);
            this.comments = this.comments.concat(modelComments);
            this.canUpdateComments = true;
        }
    }

    private setComments = async (newsId: number): Promise<void> => {
        if (this.previousNewsId != newsId) {
            this.comments = await ModelComment.fetchInitialUserComments(newsId);
        }
    }

    //TODO: Протестировать все случаи
    private renderComments(newsId: number) {
        const isNewNews = this.previousNewsId != newsId;

        if (this.previousNewsId === undefined) {
            this.attachCommentsNodes(this.comments);
        }
        else if (isNewNews && this.commentsNodes.length === this.comments.length) {
            this.updateCommentsAttribute(this.comments, this.commentsNodes);
        }
        else if (isNewNews && this.comments.length > this.commentsNodes.length) {
            this.updateCommentsAttribute(this.comments.slice(0, this.commentsNodes.length), this.commentsNodes);
            this.attachCommentsNodes(this.comments.slice(this.commentsNodes.length, this.comments.length), true);
        }
        else if (isNewNews && this.comments.length < this.commentsNodes.length) {
            this.updateCommentsAttribute(this.comments, this.commentsNodes.slice(0, this.comments.length));
            this.removeCommentsNodes(this.comments.length, this.commentsNodes.length);
        }
    }

    private removeCommentsNodes(start: number, end: number) {
        this.commentsNodes.splice(start, end - start).forEach(deletedCommentNode => deletedCommentNode.remove());
    }

    private attachCommentsNodes(commentsModels: UserComment[], isPartModel: boolean = false) {
        let addedComments: HTMLComment[] = [];

        if (isPartModel) {
            addedComments = this.commentRenderer.renderMany(commentsModels) as HTMLComment[];
            this.commentsNodes = this.commentsNodes.concat(addedComments);
        }
        else {
            addedComments = this.commentsNodes = this.commentRenderer.renderMany(commentsModels) as HTMLComment[];
        }

        addedComments.forEach(commentNode => {
            this.setAnimationRules(commentNode);
            this.commentsListElement.append(commentNode);
        });
    }

    private updateCommentsAttribute(model: UserComment[], nodes: HTMLComment[]) {
        for (let i = 0; i < nodes.length; i++) {
            nodes[i].setAttribute('comment', model[i].comment);
            nodes[i].setAttribute('nickname', model[i].nickname);
        }
    }

    private setAnimationRules(commentNode: HTMLComment) {
        commentNode.hide();
        this.observer.observe(commentNode);
    }

    private onIntersectComment: IntersectionObserverCallback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                (entry.target as HTMLComment).show();
                observer.unobserve(entry.target);
            }
        });
    }

    private observer: IntersectionObserver = new IntersectionObserver(this.onIntersectComment, {
        threshold: .65
    });
}