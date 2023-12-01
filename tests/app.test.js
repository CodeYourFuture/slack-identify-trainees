import crypto from 'crypto';
import { server } from './server.js';
import { handler } from '../netlify/functions/slack-app.js';
import teamJoinRequest from '../requests/team_join.json' assert { type: 'json' };

async function sendRequest() {
    const result = await handler(createSlackRequest(teamJoinRequest));
    console.log(result);
}

sendRequest();


// describe('slack app', () => {
//     it('returns 200 after receiving message event', async () => {
//         const result = await handler(createSlackRequest({ 'type': 'message' }));
//         console.log(result);
//         // expect(result.statusCode).toBe(200);
//     });
// });

function createSlackRequest(data, path = '/slack/events') {
    const body = JSON.stringify(data);
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = crypto
        .createHmac('sha256', 'my-secret')
        .update(`v0:${timestamp}:${body}`)
        .digest('hex');

    return {
        body,
        path,
        headers: {
            'content-type': 'application/json',
            'x-slack-request-timestamp': timestamp.toString(),
            'x-slack-signature': `v0=${signature}`,
        },
        httpMethod: 'POST',
    };
};