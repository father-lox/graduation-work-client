export default class HTMLNews extends HTMLElement {
    constructor(templateId: string = 'news') {
        super();

        this.template = document.getElementById(templateId) as HTMLTemplateElement;
        this.newsNode = this.template.content.cloneNode(true) as HTMLDivElement;
        
        this.titleElement = this.newsNode.querySelector('#title') as HTMLHeadingElement;
        this.commentButtonElement = this.newsNode.querySelector('#comment-button') as HTMLButtonElement;
        this.sourceElement = this.newsNode.querySelector('#source') as HTMLLinkElement;

        this.viewsCountElement = this.newsNode.querySelector('#views') as HTMLLIElement;      
        this.viewsCountTextNode = document.createTextNode('');  
        
        this.commentsCountElement = this.newsNode.querySelector('#comments') as HTMLLIElement;
        this.commentsCountTextNode = document.createTextNode('');  

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

    connectedCallback() {
        const root: ShadowRoot = this.attachShadow(this.shadowDOMProperty);
        root.appendChild(this.newsNode);
        this.initData();
        this.initEvents();
    }

    static get observedAttributes() {
        return ['title', 'views', 'comments'];
    }

    static availableAttributes: {sourceLink: string, sourceTitle: string} = {
        sourceLink: 'source-link',
        sourceTitle: 'source-title'
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        switch (name) {
            case 'title':
                this.updateTitle(newValue);
                break;
            case 'views':
                this.updateViewsCount(newValue);
                break;
            case 'comments':
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
    private viewsCountTextNode: Text;
    private commentsCountElement: HTMLLIElement;
    private commentsCountTextNode: Text;
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
        const title: string = this.getAttribute('title') || '';

        if (title.length === 0) {
            throw new Error('"title" attribute is required');
            
        }

        this.titleElement.textContent = title;
    }

    private setViewsCount() {
        const viewsCount: string = this.getAttribute('views') || '';

        if (viewsCount.length === 0) {
            throw new Error('"title" attribute is required');
            
        }

        this.viewsCountElement.append(viewsCount.toString());
    }

    private setCommentsCount() {
        const commentsCount: string = this.getAttribute('comments') || '';

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

        this.viewsCountTextNode.textContent = newValue;
    }

    private updateCommentsCount(newValue: string) {
        if (!Number.isInteger(Number(newValue))) {
            throw 'value must be a number'
        }

        this.commentsCountTextNode.textContent = newValue;
    }
}