export default class HTMLNews extends HTMLElement {
    constructor(templateId: string = 'news') {
        super();

        this.template = document.getElementById(templateId) as HTMLTemplateElement;
        this.newsNode = this.template.content.cloneNode(true) as HTMLDivElement;
        
        this.titleElement = this.newsNode.querySelector('#title') as HTMLHeadingElement;
        this.commentButtonElement = this.newsNode.querySelector('#comment-button') as HTMLButtonElement;
        this.sourceElement = this.newsNode.querySelector('#source') as HTMLLinkElement;
        this.viewsCountElement = this.newsNode.querySelector('#views') as HTMLLIElement;            
        this.commentsCountElement = this.newsNode.querySelector('#comments') as HTMLLIElement;

        if (!(this.template || 
            this.newsNode ||
            this.sourceElement || 
            this.titleElement ||
            this.viewsCountElement ||
            this.commentsCountElement ||
            this.commentButtonElement)) {
            throw new Error("Template is incorrect");
        }
    }

    increaseCountViews() {
        let views: number = Number.parseInt(this.getAttribute(HTMLNews.availableAttributes.views) || '') || 0;

        views++;
        this.setAttribute(HTMLNews.availableAttributes.views, views.toString());
    }

    increaseCountComments() {
        let views: number = Number.parseInt(this.getAttribute(HTMLNews.availableAttributes.comments) || '') || 0;

        views++;
        this.setAttribute(HTMLNews.availableAttributes.comments, views.toString());
    }

    connectedCallback() {
        const root: ShadowRoot = this.attachShadow(this.shadowDOMProperty);
        root.appendChild(this.newsNode);
        this.initData();
        this.initEvents();
    }

    static get observedAttributes() {
        return [
            HTMLNews.availableAttributes.title, 
            HTMLNews.availableAttributes.comments,
            HTMLNews.availableAttributes.comments
        ];
    }

    static availableAttributes = {
        sourceLink: 'source-link',
        sourceTitle: 'source-title',
        title: 'title',
        views: 'views',
        comments: 'comments'
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        switch (name) {
            case HTMLNews.availableAttributes.title:
                this.updateTitle(newValue);
                break;
            case HTMLNews.availableAttributes.views:
                this.updateViewsCount(newValue);
                break;
            case HTMLNews.availableAttributes.comments:
                this.updateCommentsCount(newValue);
                break;
            default:
                break;
        }
    }

    private template: HTMLTemplateElement;
    private newsNode: HTMLDivElement;
    private titleElement: HTMLHeadingElement;
    private viewsCountElement: HTMLLIElement;
    private commentsCountElement: HTMLLIElement;
    private commentButtonElement: HTMLButtonElement;
    private sourceElement: HTMLLinkElement;

    private shadowDOMProperty: ShadowRootInit = {
        mode: 'closed'
    }

    private initData() {
        this.setTitle();
        this.setViewsCount();
        this.setCommentsCount();
        this.setSources();
    }

    private initEvents() {
        const newsId = Number(this.getAttribute('id'));

        if (!newsId) {
            throw Error('Attribute id is not set');
        }

        const showCommentsEvent: CustomEvent = new CustomEvent('show-comments', {
            composed: true,
            bubbles: true,
            detail: {
                newsId: newsId,
            }
        });

        this.onButtonCommentClick(showCommentsEvent);
    }

    private onButtonCommentClick(generatedEvent: CustomEvent) {
        this.commentButtonElement.addEventListener('click', () => {
            this.dispatchEvent(generatedEvent);
        });
    }

    private setTitle() {
        const title: string = this.getAttribute(HTMLNews.availableAttributes.title) || '';

        if (title.length === 0) {
            throw new Error('"title" attribute is required');
            
        }

        this.titleElement.textContent = title;
    }

    private setViewsCount() {
        const viewsCount: string = this.getAttribute(HTMLNews.availableAttributes.views) || '';

        if (viewsCount.length === 0) {
            throw new Error('"title" attribute is required');
            
        }

        this.viewsCountElement.append(viewsCount.toString());
    }

    private setCommentsCount() {
        const commentsCount: string = this.getAttribute(HTMLNews.availableAttributes.comments) || '';

        if (commentsCount.length === 0) {
            throw new Error('"title" attribute is required');
            
        }

        this.commentsCountElement.append(commentsCount.toString());
    }

    private setSources() {
        const href: string = this.getAttribute(HTMLNews.availableAttributes.sourceLink) || '';
        const title: string = this.getAttribute(HTMLNews.availableAttributes.sourceTitle) || '';

        if (href.length === 0) {
            throw new Error(`${HTMLNews.availableAttributes.sourceLink} attribute is required`);
        } else if (title.length === 0) {
            throw new Error(`${HTMLNews.availableAttributes.sourceTitle} attribute is required`);
        }

        this.sourceElement.href = href;
        this.sourceElement.title = title;
    }

    private updateTitle(newValue: string) {
        this.titleElement.innerText = newValue;
    }

    private updateViewsCount(newValue: string) {
        if (!Number.isInteger(Number(newValue))) {
            throw 'value must be a number'
        }

        const countViewsNode = this.findTextNode(this.viewsCountElement);

        if (countViewsNode) {
            countViewsNode.nodeValue = newValue;
        }
    }

    private updateCommentsCount(newValue: string) {
        if (!Number.isInteger(Number(newValue))) {
            throw 'value must be a number'
        }

        const countCommentsNode = this.findTextNode(this.commentsCountElement);

        if (countCommentsNode) {
            countCommentsNode.nodeValue = newValue;
        }
    }

    private findTextNode(element: HTMLElement) {
        return Array.from(element.childNodes).find(node => node.nodeType === node.TEXT_NODE);
    }
}