export default class ModelComment {
    constructor(
        readonly nickname: string,
        readonly comment: string,
        readonly isAuthor: boolean
    ) {}
}