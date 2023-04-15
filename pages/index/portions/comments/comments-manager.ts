import ModelComment from 'models/model-comment.js';
import RenderComment from 'renders/render-comment.js';
import UserComment from 'types/user-comment.js';
import HTMLComment from 'code/ui-components/comment/html-comment.js';
import ModalWindow from 'code/ui-components/modal-window/modal-window.js';
import autoResizeHeightTextarea from 'code/ui-components/inputs/expressive-input/auto-resize-height-textarea.js'

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

    /**
     * Hide comments
     */
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

    /**
     * Calling when news comment modal was scrolled to trigger point
     * @param {CustomEvent} event
     */
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

    /**
     * Calling when news emit show-comments event
     * @param {CustomEvent} event
     */
    private onNewsSectionShowComments = (event: CustomEvent) => {
        this.canUpdateComments = true;
        this.currentNewsId = event.detail.newsId;
        this.loadAndRenderInitialComments(this.currentNewsId);
        this.commentModelWindow.show();
    }

    /**
     * Load and render initial fetching comments
     * @param newsId {number} - News identifier
     */
    private loadAndRenderInitialComments(newsId: number) {
        this.setComments(newsId).then(() => {
            this.renderComments(newsId)
            this.previousNewsId = newsId;
        }).catch(error => console.error(error));
    }

    /**
     * Load and render additional fetching comments
     */
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

    /**
     * Load comments and save theme to comments array
     * @param newsId {number} - News identifier 
     */
    private setComments = async (newsId: number): Promise<void> => {
        if (this.previousNewsId != newsId) {
            this.comments = await ModelComment.fetchInitialUserComments(newsId);
        }
    }

    //TODO: Протестировать все случаи
    /**
     * Render comments or update attributes existing or remove exhausting
     * @param newsId {number} - News identifier 
     */
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

    /**
     * Remove comments elements from commentsNodes between start and end indexes
     * @param start {number} - Start index
     * @param end {number} - End index
     */
    private removeCommentsNodes(start: number, end: number) {
        this.commentsNodes.splice(start, end - start).forEach(deletedCommentNode => deletedCommentNode.remove());
    }

    /**
     * Render comments elements, maintain them to the DOM and prepare for show animation
     * @param commentsModels 
     * @param isPartModel 
     */
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

    /**
     * Update attributes of the comments from model
     * @param model {UserComment[]} - Comments model
     * @param nodes {HTMLComment[]} - HTML elements as comments
     */
    private updateCommentsAttribute(model: UserComment[], nodes: HTMLComment[]) {
        for (let i = 0; i < nodes.length; i++) {
            nodes[i].setAttribute('comment', model[i].comment);
            nodes[i].setAttribute('nickname', model[i].nickname);
        }
    }

    /**
     * Hide comment and init on theme observer
     * @param commentNode 
     */
    private setAnimationRules(commentNode: HTMLComment) {
        commentNode.hide();
        this.observer.observe(commentNode);
    }

    /**
     * Show comments if it is visible 
     * @param entries 
     * @param observer 
     */
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