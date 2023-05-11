import { ReadableNewsFields, Source, UserComment } from 'types/api.js';

export default class ModelNews {
    constructor(
        readonly id: number,
        readonly title: string,
        readonly countViews: number,
        readonly countComments: number,
        readonly sources: Source[],
        readonly authorComment?: UserComment,
    ) { }

    static requestAddress: string | null = 'http://localhost/api/news';

    static async getNews(): Promise<ModelNews[] | null> {
        const unserializedNews: Array<any> | null = await this.loadInOrder();

        if (!unserializedNews) {
            return null;
        }
        
        return this.serializeMany(unserializedNews);
    }

    static async loadInOrder(): Promise<Array<Object> | null> {
        //TODO: Think about move code below to APIManager class
        if (this.requestAddress === null) {
            return null;
        }

        return fetch(this.requestAddress, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Accept': 'application/json'
            },
        }).then(response => {
            return response.json();
        }).then(({ data: arrayNews, links }) => {
            this.requestAddress = links.next;
            return arrayNews;
        });
    }

    static serializeOne(
        id: number,
        title: string,
        nickname: string,
        comment: string,
        countViews: number,
        countComments: number,
        sources: Source[]
    ): ModelNews {
        let commentByAuthor: UserComment | undefined;

        if (comment) {
            commentByAuthor = { nickname, comment };
        }

        return new ModelNews(id, title, countViews, countComments, sources, commentByAuthor);
    }

    static serializeMany(unserializedNews: Array<any>): ModelNews[] {
        return unserializedNews.map(news => {
            return this.serializeOne(
                Number(news[ReadableNewsFields.id]),
                news[ReadableNewsFields.title],
                news[ReadableNewsFields.nickname],
                news[ReadableNewsFields.authorComment],
                news[ReadableNewsFields.countViews],
                news[ReadableNewsFields.countComments],
                news[ReadableNewsFields.sources],
            )
        }) as ModelNews[];
    }
}