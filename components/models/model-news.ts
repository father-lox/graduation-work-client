import ModelComment from './model-comment.js';

export default class ModelNews {
    constructor(
        readonly title: string,
        readonly authorComment: ModelComment
    ) {}

    static requestAddress: string = 'http://localhost/api/posts';

    static async getNews(): Promise<ModelNews[]> {
        const unserializedNews: Array<any> = await this.loadInOrder();
        return this.serializeMany(unserializedNews);
    }

    static async loadInOrder(): Promise<Array<Object>> {
        return fetch(this.requestAddress, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        }).then(response => {
            return response.json();
        }).then(({data: arrayNews, links}) => {
            this.requestAddress = links.next;
            return arrayNews;
        });
    }

    static serializeOne(
        title: string,
        nickname: string,
        comment: string,
    ): ModelNews {
        const commentByAuthor = new ModelComment(nickname, comment, true);
        return new ModelNews(title, commentByAuthor);
    }

    static serializeMany(unserializedNews: Array<any>): ModelNews[] {
        return unserializedNews.map(news => {
            return this.serializeOne(news.title, news['author'], news['author_comment'])
        }) as ModelNews[];
    }
}