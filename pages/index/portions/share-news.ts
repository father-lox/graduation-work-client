import HTMLNews from '../../../code/ui-components/news/html-news.js';

export default class ShareNews {
    constructor() {
        document.addEventListener(HTMLNews.availableEvents.shareNews, this.onNewsShare);
    }

    public isShareLink() {
        return this.currentUrl.searchParams.has(this.shareNewsSearchParameter);
    }

    public getShredNewsId(): number | null {
        const value = this.currentUrl.searchParams.get(this.shareNewsSearchParameter);

        if (value === null) {
            return value;
        } else {
            return Number(value);
        }
    }

    private shareNewsSearchParameter = 'shareNews';
    private currentUrl = new URL(location.href);

    private onNewsShare = async (event: Event) => {
        const newsId: number = (event as CustomEvent).detail.newsId;
        await this.copyShareLink(newsId);
        this.notifyCopySuccess();
    }

    private copyShareLink(newsId: number) {
        const shareLink = new URL(location.href);

        if (shareLink.searchParams.has(this.shareNewsSearchParameter)) {
            shareLink.searchParams.set(this.shareNewsSearchParameter, newsId.toString())
        } else {
            shareLink.searchParams.append(this.shareNewsSearchParameter, newsId.toString());
        }

        return navigator.clipboard.writeText(shareLink.href);
    }

    private notifyCopySuccess() {
        alert('The link was copied');
    }
}