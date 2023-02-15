export default class HTMLNews extends HTMLElement {
    constructor(templateId: string = 'news') {
        super();

        this.template = document.getElementById(templateId) as HTMLTemplateElement;
        this.newsNode = this.template.content.cloneNode(true) as HTMLDivElement;
        this.titleElement = this.newsNode.querySelector('.news__title') as HTMLHeadingElement;
        this.viewsCountElement = this.newsNode.querySelector('#views') as HTMLLIElement;      
        this.viewsCountTextNode = document.createTextNode('');  
        this.commentsCountElement = this.newsNode.querySelector('#comments') as HTMLLIElement;
        this.commentsCountTextNode = document.createTextNode('');  

        if (!(this.template || 
            this.newsNode || 
            this.titleElement ||
            this.viewsCountElement ||
            this.commentsCountElement)) {
            throw new Error("Template is incorrect");
        }
    }

    connectedCallback() {
        const root: ShadowRoot = this.attachShadow(this.shadowDOMProperty);
        root.appendChild(this.newsNode);
        this.setData();
    }

    static get observedAttributes() {
        return ['title', 'views', 'comments'];
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

    private shadowDOMProperty: ShadowRootInit = {
        mode: 'closed'
    }

    private setData() {
        this.setTitle();
        this.setViewsCount();
        this.setCommentsCount();
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