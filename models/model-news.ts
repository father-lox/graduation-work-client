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


    static requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Accept': 'application/json'
        },
    };
    static requestAddress: string | null = 'http://localhost/api/news';

    static async getOneNews(newsId: number): Promise<ModelNews | null> {
        if (this.requestAddress === null) {
            return null;
        }

        return fetch(this.requestAddress?.concat(`/${newsId}`), ModelNews.requestOptions)
        .then(response => response.json())
        .then(newsObject => this.serializeOne(
            Number(newsObject.data[ReadableNewsFields.id]),
            newsObject.data[ReadableNewsFields.title],
            newsObject.data[ReadableNewsFields.nickname],
            newsObject.data[ReadableNewsFields.authorComment],
            newsObject.data[ReadableNewsFields.countViews],
            newsObject.data[ReadableNewsFields.countComments],
            newsObject.data[ReadableNewsFields.sources],
        ))
    }

    static async getManyNews(): Promise<ModelNews[] | null> {
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

        return fetch(this.requestAddress, ModelNews.requestOptions).then(response => {
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