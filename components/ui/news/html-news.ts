export default class HTMLNews extends HTMLElement {
    constructor(templateId: string = 'news') {
        super();

        this.template = document.getElementById(templateId) as HTMLTemplateElement;
        this.newsNode = this.template.content.cloneNode(true) as HTMLDivElement;
        this.titleElement = this.newsNode.querySelector('.news__title') as HTMLHeadingElement;

        if (!(this.template || this.newsNode || this.titleElement)) {
            throw new Error("Template is incorrect");
        }
    }

    connectedCallback() {
        const root: ShadowRoot = this.attachShadow(this.shadowDOMProperty);
        root.appendChild(this.newsNode);
        this.setTitle();
    }

    static get observedAttributes() {
        return ['title'];
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        switch (name) {
            case 'title':
                this.updateTitle(newValue);
                break;
            default:
                break;
        }
    }

    private template: HTMLTemplateElement;
    private newsNode: HTMLDivElement;
    private titleElement: HTMLHeadingElement;

    private shadowDOMProperty: ShadowRootInit = {
        mode: 'closed'
    }

    private setTitle() {
        const title: string = this.getAttribute('title') || '';

        if (title.length === 0) {
            throw new Error('"title" attribute is required');
            
        }

        this.titleElement.innerText = title;
    }

    private updateTitle(title: string) {
        this.titleElement.innerText = title;
    }
}