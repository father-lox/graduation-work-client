import UserComment from '../../types/user-comment.js';

export default class ModelNews {
    constructor(
        readonly id: number,
        readonly title: string,
        readonly authorComment: UserComment,
        //TODO: Заменить моковые данные на реальные
        readonly countViews: number = 999,
        readonly countComments: number = 666,
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
        id: number,
        title: string,
        nickname: string,
        comment: string,
    ): ModelNews {
        const commentByAuthor: UserComment = {nickname, comment, isAuthor: true};
        return new ModelNews(id, title, commentByAuthor);
    }

    static serializeMany(unserializedNews: Array<any>): ModelNews[] {
        return unserializedNews.map(news => {
            return this.serializeOne(Number(news.id), news.title, news['author'], news['author_comment'])
        }) as ModelNews[];
    }
}