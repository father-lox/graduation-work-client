import APILinksNavigator from 'types/api-links-navigator.js';
import UserComment from 'types/user-comment.js';

export default class ModelComment {
    static requestAddress: string = 'http://localhost/api/comments';
    static links: APILinksNavigator;

    static async fetchInitialUserComments(newsId: number): Promise<UserComment[]> {
        return await this.loadInOrder(newsId) as UserComment[];
    }

    static async fetchAdditionalUserComments(): Promise<Array<UserComment> | null> {
        return await this.loadInOrder();
    }

    static async loadInOrder(newsId?: number): Promise<Array<UserComment> | null> {
        const requestUrl: string | null = newsId ? `${this.requestAddress}/${newsId}` : this.links.next;

        if (!requestUrl) {
            return null;
        }

        return fetch(requestUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }).then(response => {
            return response.json();
        }).then(({ data: comments, links }) => {
            this.links = links as APILinksNavigator;
            return comments as UserComment[];
        });
    }

    static canLoadAdditionalComments(): boolean {
        return this.links.next !== null;
    }
}