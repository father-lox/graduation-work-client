export default class ModelComment {
    constructor(
        readonly nickname: string,
        readonly comment: string,
        readonly isAuthor: boolean
    ) {}

    static requestAddress: string = 'http://localhost/api/comments';

    static async getComments(newsId: number): Promise<ModelComment[]> {
        const unserializedComments: Array<any> = await this.loadInOrder(newsId);
        return this.serializeMany(unserializedComments);
    }

    static async loadInOrder(newsId: number): Promise<Array<Object>> {
        return fetch(`${this.requestAddress}/${newsId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }).then(response => {
            return response.json();
        }).then(({data: comments, links}) => {
            this.requestAddress = links.next;
            return comments;
        });
    }

    static serializeOne(
        nickname: string,
        comment: string,
        isAuthor: boolean
    ): ModelComment {
        return new ModelComment(nickname, comment, isAuthor);
    }

    static serializeMany(unserializedComments: Array<any>): ModelComment[] {
        return unserializedComments.map(comment => {
            return this.serializeOne(comment.nickname, comment.comment, false)
        }) as ModelComment[];
    }
}