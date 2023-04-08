import APILinksNavigator from 'types/api-links-navigator.js';
import UserComment from 'types/user-comment.js';

export default class ModelComment {
    static requestAddress: string = 'http://localhost/api/comments';
    static links: APILinksNavigator;

    /**
     * Load first comments set
     * @param newsId {number} - Identifier of the news
     * @returns {Promise<UserComment[]>}
     */
    static async fetchInitialUserComments(newsId: number): Promise<UserComment[]> {
        return await this.loadInOrder(newsId) as UserComment[];
    }

    /**
     * Load subsequent comments set
     * @returns {Promise<Array<UserComment> | null>}
     */
    static async fetchAdditionalUserComments(): Promise<Array<UserComment> | null> {
        return await this.loadInOrder();
    }

    /**
     * Load comments of the news by its ID
     * @param [newsId {number}] - Identifier of the news
     * @returns {Promise<Array<UserComment> | null>}
     */
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

    /**
     * Check is it possible to load a next set of the comments
     * @returns {boolean}
     */
    static canLoadAdditionalComments(): boolean {
        return this.links.next !== null;
    }
}