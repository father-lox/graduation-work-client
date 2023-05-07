import UserComment from '../../../../types/user-comment.js';

export default async function sendComment(newsId: number, message: string): Promise<UserComment> {
    const response = await fetch('http://localhost/api/send-comment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
            "user_id": 56,
            "post_id": newsId,
            "comment": message
        })
    });


    return response.json() as Promise<UserComment>;
}